import {
  createSystem,
  defineConfig,
  defineRecipe,
  defaultConfig,
} from "@chakra-ui/react";

// Bordes de las superficies según el tema
export const Shadow = {
  plain: "none",
  normal: "0 0 4px rgba(244, 241, 241, 0.8)",
  neon: "0 0 8px 2px rgba(0, 255, 0, 0.8), 0 0 8px 2px rgba(0, 0, 255, 0.8)",
  sunset:
    "0 0 8px 2px rgba(255, 255, 0, 0.8), 0 0 8px 2px rgba(255, 0, 0, 0.8)",
  aurora:
    "0 0 8px 2px rgba(0, 255, 255, 0.6), 0 0 8px 2px rgba(0, 128, 255, 0.6)",
  flame:
    "0 0 8px 2px rgba(255, 165, 0, 0.8), 0 0 8px 2px rgba(255, 69, 0, 0.8)",
  galaxy:
    "0 0 8px 2px rgba(138, 43, 226, 0.7), 0 0 8px 2px rgba(72, 61, 139, 0.7)",
  lime: "0 0 8px 2px rgba(50, 205, 50, 0.8), 0 0 8px 2px rgba(173, 255, 47, 0.8)",
  mystic:
    "0 0 8px 2px rgba(192, 192, 192, 0.6), 0 0 8px 2px rgba(255, 255, 255, 0.6)",
};

export const ShadowRecipe = defineRecipe({
  base: {
    shadow: Shadow.plain,
    // color: "rgba(0, 0, 0, 0.76)",
    color: "rgba(0, 11, 114, 0.87)",
    border: "1px solid rgb(220, 220, 220)",
    backgroundColor: "rgb(220, 220, 220)",
  },
  variants: {
    look: {
      plain: { shadow: "none" },
      normal: { shadow: Shadow.normal },
      neon: { shadow: Shadow.neon },
      sunset: { shadow: Shadow.sunset },
      flame: { shadow: Shadow.flame },
      lime: { shadow: Shadow.lime },
      aurora: { shadow: Shadow.aurora },
      galaxy: { shadow: Shadow.galaxy },
      mystic: { shadow: Shadow.mystic },
    },
  },
});

export const CustomConfig = defineConfig({
  preflight: true,
  globalCss: {
    "#root": {
      minHeight: "100vh",
      maxWidth: "1280px",
      width: "100%",
      margin: "0 auto",
      backgroundColor: "rgb(56, 56, 56)",
      overflow: "auto",
    },
    root: {
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      lineHeight: "1.5",
      fontWeight: "400",
      fontSize: "16px",
      outline: "none",
      fontSynthesis: "none",
      textRendering: "optimizeLegibility",
      gap: "1rem",
    },
    body: {
      display: "flex",
      minWidth: "420px",
      color: "rgba(255, 255, 255, 0.87)",
      bg: "rgb(56, 56, 56)",
    },
  },
  theme: {
    recipes: {
      button: ShadowRecipe,
      stack: ShadowRecipe,
      box: ShadowRecipe,
    },
  },
});

export const System = createSystem(defaultConfig, CustomConfig);
