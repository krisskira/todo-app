import { useCallback, useState } from "react";
import { ShadowRecipe } from "@/core/config/theme";
import { Box, HStack, Icon, Input, useRecipe } from "@chakra-ui/react";
import { Button as IconButton } from "../ui/button";
import {
  LuListTodo as AllIcon,
  LuListChecks as CompletedIcon,
  LuPlus,
  LuLayoutList as PendingIcon,
} from "react-icons/lu";
import { Filter } from "todo-types";
import { RadioCardItem, RadioCardRoot } from "../ui/radio-card";

export type TaskFilterInputProps = {
  onChangeFilters: (filters: Filter) => void;
  onAddTask?: () => void;
};

export const DefaultFilters: Filter = {
  offset: 0,
  limit: 5,
};

export const TaskFilter: React.FC<TaskFilterInputProps> = (props) => {
  const { onChangeFilters = () => undefined, onAddTask = () => undefined } =
    props;
  const [filters, setFilters] = useState<Filter>(DefaultFilters);
  const [debounceId, setDebounceId] = useState<NodeJS.Timeout>();

  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "normal" });

  const debounce = useCallback(
    (callback: () => void, delay: number) => {
      if (debounceId) clearTimeout(debounceId);
      setDebounceId(
        setTimeout(() => {
          callback();
        }, delay)
      );
    },
    [debounceId]
  );

  const _onChangeFilters = (key: keyof Filter, value?: string | boolean) => {
    const _filters = { ...filters, [key]: value };
    if (value === undefined) delete _filters[key];
    setFilters(_filters);
    onChangeFilters(_filters);
  };

  return (
    <Box mt={4} p={4} borderRadius={"md"} css={styles}>
      {/* Input de búsqueda */}
      <Box mb={4} display="flex" alignItems="center">
        <Input
          placeholder="Buscar..."
          mr={4}
          onChange={(e) =>
            debounce(() => _onChangeFilters("query", e.target.value), 500)
          }
        />
        <IconButton
          size="sm"
          aria-label="Agregar nueva tarea"
          rounded="lg"
          variant="surface"
          look="aurora"
          color={"blue.500"}
          onClick={onAddTask}
        >
          <LuPlus />
        </IconButton>
      </Box>
      {/* Filtros de búsqueda */}
      <Box mt={4}>
        <RadioCardRoot
          size="sm"
          maxW="100px"
          align="center"
          defaultValue="none"
          orientation="horizontal"
          onChange={({ target }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const e = target.value as keyof Filter["completed"];
            const value = e === "none" ? undefined : e === "true";
            console.log(">>> Value: ", { value, e });
            _onChangeFilters("completed", value);
          }}
        >
          <HStack align="stretch">
            <RadioCardItem
              value={"none"}
              rounded={"full"}
              indicator={false}
              icon={
                <Icon fontSize="2xl">
                  <AllIcon />
                </Icon>
              }
              _checked={{
                color: "gray.500",
                borderColor: "gray",
                boxShadow:
                  "0 0 2px 1px rgba(0, 255, 255, 0.6), 0 0 2px 1px rgba(0, 128, 255, 0.6)",
              }}
            />
            <RadioCardItem
              value={"true"}
              rounded={"full"}
              indicator={false}
              icon={
                <Icon fontSize="2xl">
                  <CompletedIcon />
                </Icon>
              }
              _checked={{
                // bg: "green.500", // Fondo personalizado
                color: "green.500", // Color del texto
                borderColor: "green", // Color del borde
                boxShadow:
                  "0 0 2px 1px rgba(0, 255, 0, 0.8), 0 0 2px 1px rgba(0, 0, 255, 0.8)",
              }}
            />
            <RadioCardItem
              value={"false"}
              rounded={"full"}
              indicator={false}
              icon={
                <Icon fontSize="2xl">
                  <PendingIcon />
                </Icon>
              }
              _checked={{
                color: "orange",
                borderColor: "transparent",
                boxShadow:
                  "0 0 2px 1px rgba(255, 255, 0, 0.8), 0 0 2px 1px rgba(255, 0, 0, 0.8)",
              }}
            />
          </HStack>
        </RadioCardRoot>
      </Box>
    </Box>
  );
};
