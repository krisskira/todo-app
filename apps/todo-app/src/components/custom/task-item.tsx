import { Shadow, ShadowRecipe } from "@/core/config/theme";
import { Box, Spacer, Stack, Text, useRecipe } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { Todo } from "todo-types";
import moment from "moment";
import { useMemo } from "react";
import { IconButton } from "@chakra-ui/react";
import { LuPencil, LuTrash } from "react-icons/lu";

export type TaskItemProps = {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onDeleteTask?: (taskId: string) => void;
};
export const TaskItem: React.FC<TaskItemProps> = (props) => {
  const {
    uuid = "",
    title = "",
    description = "",
    completed = "",
    createdAt = "",
  } = props?.todo || {};
  const onEdit = props?.onEdit || (() => undefined);
  const onDeleteTask = props?.onDeleteTask || (() => undefined);

  const look = completed ? "neon" : "sunset";
  const line = completed ? "green" : "rgb(244, 196, 52)";
  const completedText = completed ? "Completado" : "Pendiente";

  const [day, month] = useMemo(() => {
    const date = moment(createdAt);
    return [date.format("DD"), date.format("MMM")];
  }, [createdAt]);
  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look });

  return (
    <Box itemID={`task-item:${uuid}`} css={styles} borderRadius={"md"}>
      <Stack direction={"row"} h={"100%"}>
        <Box
          p={4}
          textAlign={"center"}
          justifyContent={"center"}
          borderRight={`0.5px solid ${line}`}
        >
          <Text fontSize={"small"} fontWeight="bold">
            {month.toUpperCase()}
          </Text>
          <Text fontSize={"2xl"} fontWeight="bold">
            {day}
          </Text>
        </Box>
        <Box w="full">
          <Stack p={2} gap={4} h={"100%"} direction={"column"}>
            <Box>
              <Text fontWeight="medium" fontSize={"large"}>
                {title}
              </Text>
              <Tag
                variant={"surface"}
                // bg={"none"}
                // shadow={"none"}
                shadow={
                  completed
                    ? "0 0 2px 0.5px rgba(0, 255, 0, 0.8), 0 0 2px 0.5px rgba(0, 0, 255, 0.8)"
                    : "0 0 2px 0.5px rgba(255, 165, 0, 0.8), 0 0 2px 0.5px rgba(255, 69, 0, 0.8)"
                }
                color={completed ? ["green"] : ["orange"]}
                // fontWeight={"semibold"}
              >
                {completedText}
              </Tag>
            </Box>
            <Box>
              <Text color={"gray.500"}>{description}</Text>
            </Box>
            <Spacer />
            <Box display={"flex"}>
              <Spacer />
              <IconButton
                rounded="full"
                variant="ghost"
                aria-label={"Borrar Tarea"}
                onClick={() => onDeleteTask(props.todo.uuid)}
                mr={4}
              >
                <LuTrash />
              </IconButton>
              <IconButton
                rounded="full"
                variant="ghost"
                aria-label={"Edit Task"}
                onClick={() => onEdit(props.todo)}
              >
                <LuPencil />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
