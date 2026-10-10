import { defaultDarkTheme } from "react-admin";
import type { RaThemeOptions } from "react-admin";

/**
 * A dark admin theme that echoes the public site's brand colors without
 * trying to look like the public site — the admin should read as a tool,
 * not a second portfolio.
 */
export const adminTheme: RaThemeOptions = {
  ...defaultDarkTheme,
  palette: {
    mode: "dark",
    primary: { main: "#899474" },
    secondary: { main: "#899474" },
    background: {
      default: "#181818",
      paper: "#222222",
    },
    text: {
      primary: "#EDEBE6",
      secondary: "#A0A0A0",
    },
  },
  typography: {
    fontFamily: "Manrope, Inter, Arial, sans-serif",
  },
  components: {
    ...defaultDarkTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#181818",
          borderBottom: "1px solid #464646",
        },
      },
    },
  },
};
