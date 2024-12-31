import { Box, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { LuLinkedin, LuMail, LuPhone } from "react-icons/lu";

export const DevContact: React.FC = () => {
  return (
    <Box
      width={"full"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
    >
      <Text color={"gray.500"} textAlign={"center"}>
        <strong>Bienvenido, Desarrollado por</strong>
        <br />
        <strong>Crhistian Vergara</strong>
      </Text>
      <Stack
        mt={2}
        mb={4}
        direction={"row"}
        gap={8}
        w={"full"}
        justify={"center"}
        align={"center"}
      >
        <Box>
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/cristian-david-vergara-gomez/"
            mb={4}
          >
            <Icon size={"md"} as={LuLinkedin} color={"blue.500"}>
              <LuLinkedin />
            </Icon>
          </Link>
        </Box>
        <Box>
          <Link target="_blank" href="https://wa.link/ix5poo" mb={4}>
            <Icon size={"md"} as={LuLinkedin} color={"blue.500"}>
              <LuPhone />
            </Icon>
          </Link>
        </Box>
        <Box>
          <Link target="_blank" href="mailto:krisskira@gmail.com" mb={4}>
            <Icon size={"md"} as={LuLinkedin} color={"blue.500"}>
              <LuMail />
            </Icon>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
