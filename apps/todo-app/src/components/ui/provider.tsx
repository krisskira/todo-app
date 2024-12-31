"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { System } from "@/core/config/theme";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={System}>
      <ColorModeProvider {...props} forcedTheme="light" />
    </ChakraProvider>
  );
}
