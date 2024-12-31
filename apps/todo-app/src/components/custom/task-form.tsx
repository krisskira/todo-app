"use client";

import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Box,
  Group,
  Icon,
  Input,
  Show,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Todo } from "todo-types";
import { Field } from "../ui/field";

import { Switch } from "../ui/switch";
import {
  LuListChecks as CompletedIcon,
  LuLayoutList as PendingIcon,
} from "react-icons/lu";

export type TaskFormProps = {
  task?: Partial<Todo>;
  onClose?: () => void;
  onSave: (task: Partial<Todo>) => void;
  isLoading?: boolean;
  hasError?: boolean;
};

export const TaskForm: React.FC<TaskFormProps> = (props) => {
  const { task, onClose = () => undefined, onSave = () => undefined } = props;

  const color = "rgba(0, 11, 114, 0.87)";
  const title = task?.uuid ? "Editar Tarea" : "Crear Tarea";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Partial<Todo>>({
    values: {
      uuid: task?.uuid,
      title: task?.title,
      description: task?.description,
      completed: task?.completed || false,
    },
    defaultValues: {
      uuid: task?.uuid,
      title: task?.title,
      description: task?.description,
      completed: task?.completed || false,
    },
  });

  const onSubmit: SubmitHandler<Partial<Todo>> = (task) => {
    if (!props.task?.uuid) {
      return onSave({
        title: task.title,
        description: task.description,
      });
    }
    onSave({ ...task, completed: Boolean(task.completed) });
  };

  return (
    <DialogRoot
      lazyMount
      open={!!task}
      onOpenChange={({ open }) => !open && onClose()}
    >
      <DialogContent maxW="lg" color={color}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            {/* {JSON.stringify(errors || {})} */}
            <Stack gap="4" align="flex-start" maxW="full">
              <Group w="full" alignItems={"flex-start"} gap={4}>
                <Box w="full">
                  <Field
                    label="Título"
                    invalid={!!errors.title}
                    errorText={errors.title?.message}
                  >
                    <Input
                      maxLength={30}
                      minLength={2}
                      placeholder="Título"
                      {...register("title", {
                        maxLength: {
                          value: 30,
                          message:
                            "El título no puede tener más de 30 caracteres",
                        },
                        minLength: {
                          value: 2,
                          message: "El título debe tener al menos 2 caracteres",
                        },
                        required: {
                          value: true,
                          message: "Una tarea debe tener un título",
                        },
                      })}
                    />
                  </Field>
                </Box>

                <Show when={!!task?.uuid}>
                  <Box>
                    <Field
                      label="Estado de la tarea"
                      invalid={!!errors.completed}
                      errorText={errors.completed?.message}
                    >
                      <Switch
                        size="lg"
                        variant={"solid"}
                        trackLabel={{
                          on: (
                            <Icon color="green.500" borderColor="green">
                              <CompletedIcon />
                            </Icon>
                          ),
                          off: (
                            <Icon color="orange">
                              <PendingIcon />
                            </Icon>
                          ),
                        }}
                        {...register("completed")}
                      >
                        {watch("completed") ? "Completado" : "Pendiente"}
                      </Switch>
                    </Field>
                  </Box>
                </Show>
              </Group>
              <Field
                label="Descripción"
                invalid={!!errors.description}
                errorText={errors.description?.message}
              >
                <Textarea
                  placeholder="Descripción"
                  {...register("description", {
                    maxLength: {
                      value: 100,
                      message:
                        "La descripción no puede tener más de 100 caracteres",
                    },
                    minLength: {
                      value: 2,
                      message:
                        "La descripción debe tener al menos 2 caracteres",
                    },
                    required: {
                      value: true,
                      message: "Una tarea debe tener una descripción",
                    },
                  })}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              look="normal"
              type="submit"
              color={color}
              loading={props.isLoading}
              disabled={props.isLoading}
              loadingText={props.isLoading ? "Guardando..." : "Guardar"}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
