import {
  DefaultFilters,
  TaskFilter,
} from "@/components/custom/task-filter-input";
import { TaskForm } from "@/components/custom/task-form";
import { TaskItem } from "@/components/custom/task-item";
import { Alert } from "@/components/ui/alert";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/core/api/requests";
import {
  Box,
  Button,
  Code,
  For,
  HStack,
  Show,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Filter, Todo, TodoListDtoSchema, TodoPutDtoSchema } from "todo-types";
import { Toaster, toaster } from "@/components/ui/toaster";

export type TaskPageProps = {
  children?: React.ReactNode;
};

const TaskResponseEmpty: TodoListDtoSchema = {
  todos: [],
  metadata: {
    total: 0,
    hasNext: false,
    hasPrevious: false,
    nextLimit: 0,
    nextOffset: 0,
    previousLimit: 0,
    previousOffset: 0,
  },
};

export const TaskPage: React.FC<TaskPageProps> = () => {
  const [selectedTodo, setSelectedTodo] = useState<Partial<Todo> | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<Filter>(DefaultFilters);
  const {
    data: Tasks = TaskResponseEmpty,
    error,
    isError,
  } = useGetTasksQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteTask, { isError: isDeleteError }] = useDeleteTaskMutation();
  const [createTask, { isError: isCreateError, isLoadingCreateTask }] =
    useCreateTaskMutation();
  const [updateTask, { isError: isUpdateError, isLoading: isUpdateLoading }] =
    useUpdateTaskMutation();

  const onChangeFilters = (filters: Filter) => {
    setFilters(filters);
  };

  const onSaveTask = async (task: Partial<Todo>) => {
    try {
      if (!task.uuid) {
        await createTask({
          title: task.title as string,
          description: task.description as string,
        }).unwrap();
        toaster.success({
          title: "Tarea creada",
          description: "La tarea ha sido creada correctamente",
        });
        setSelectedTodo(undefined);
        return;
      }
      await updateTask(task as TodoPutDtoSchema).unwrap();
      toaster.success({
        title: "Tarea actualizada",
        description: "La tarea ha sido actualizada correctamente",
      });
      setSelectedTodo(undefined);
    } catch {
      toaster.error({
        type: "error",
        title: "Error al actualizar tarea",
        description: "Revisa los datos que has ingresado",
      });
    }
  };

  const onDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({
        uuid: taskId,
      }).unwrap();

      toaster.success({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada correctamente",
      });
    } catch {
      toaster.error({
        type: "error",
        title: "Error al eliminar tarea",
        description: "Revisa los datos que has ingresado",
      });
    }
  };

  return (
    <Box>
      {/* Alerta de error */}
      <Show when={isError}>
        <Alert status="error" title="Error">
          <Text color={"red.500"}>No se pudo cargar los datos</Text>
          <Code mt={5} color={"gray.500"}>
            {JSON.stringify(error || {})}
          </Code>
          <Box mt={4} textAlign={"end"}>
            <Button mt={4} onClick={() => setFilters(DefaultFilters)}>
              Intentar nuevamente
            </Button>
          </Box>
        </Alert>
      </Show>

      {/* Filtros de búsqueda */}
      <TaskFilter
        onAddTask={() => setSelectedTodo({ title: "", description: "" })}
        onChangeFilters={onChangeFilters}
      />

      {/* Grid de tareas */}
      <SimpleGrid
        mt={6}
        gap={4}
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
        columns={{ base: 1, md: 3 }}
      >
        <For each={Tasks.todos}>
          {(task) => (
            <TaskItem
              todo={task}
              key={task.uuid}
              onDeleteTask={onDeleteTask}
              onEdit={setSelectedTodo}
            />
          )}
        </For>
      </SimpleGrid>

      {/* Paginación */}
      <Box mt={6}>
        <PaginationRoot
          count={Tasks.metadata.total}
          pageSize={DefaultFilters.limit}
          justifyItems={"end"}
          variant="solid"
          size={"sm"}
          onPageChange={({ page, pageSize }) => {
            console.log(">>> Page: ", { page, pageSize });
            console.log(">>> Offset: ", Tasks.metadata.nextOffset);
            onChangeFilters({
              ...filters,
              offset: (page - 1) * (DefaultFilters.limit || 1),
            });
          }}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Box>

      {/* Formulario de agregar/edición tarea */}
      <TaskForm
        task={selectedTodo}
        onSave={onSaveTask}
        onClose={() => setSelectedTodo(undefined)}
        isLoading={isLoadingCreateTask || isUpdateLoading}
        hasError={isCreateError || isUpdateError}
      />
      <Toaster />
    </Box>
  );
};
