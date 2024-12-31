import { Spacer, Stack, Text, useRecipe } from "@chakra-ui/react";
import React from "react";
import { User } from "todo-types";
import { Avatar } from "../ui/avatar";
import { ShadowRecipe } from "@/core/config/theme";
import { CloseButton } from "../ui/close-button";
import { Link } from "react-router";

export type UserInfoProps = {
  user: User;
  onClose?: () => void;
};

export const UserInfoVertical: React.FC<UserInfoProps> = (props) => {
  const { email, firstName, lastName, uuid } = props.user;
  const name = `${firstName} ${lastName}`;

  const colorPalette = ["blue"];
  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "normal" });

  return (
    <Stack
      p={4}
      key={uuid}
      css={styles}
      alignItems="center"
      direction={"column"}
      borderRadius={"md"}
    >
      <Link to="/user">
        <Avatar name={name} size={"2xl"} colorPalette={pickPalette(name)} />
      </Link>
      <Stack gap="0" align="center" w="full">
        <Text fontWeight="medium">{name}</Text>
        <Text color="fg.muted" textStyle="sm">
          {email}
        </Text>
      </Stack>
    </Stack>
  );
};

export const UserInfoHorizontal: React.FC<UserInfoProps> = ({
  user,
  onClose = () => undefined,
}) => {
  const { email, firstName, lastName, uuid } = user;
  const name = `${firstName} ${lastName}`;

  const colorPalette = ["red"];
  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "normal" });

  return (
    <Stack
      p={4}
      key={uuid}
      css={styles}
      alignItems="center"
      direction={"row"}
      borderRadius={"md"}
    >
      <Link to="/user">
        <Avatar name={name} size={"lg"} colorPalette={pickPalette(name)} />
      </Link>

      <Stack gap="0" align="start" w="full">
        <Text fontWeight="medium">{name}</Text>
        <Text color="fg.muted" textStyle="sm">
          {email}
        </Text>
      </Stack>
      <Spacer />
      <CloseButton size="sm" variant="ghost" onClick={onClose} />
    </Stack>
  );
};
