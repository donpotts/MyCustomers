"use client";

import { type PaletteOptions, createTheme } from "@mui/material";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
});

const palette: PaletteOptions = {};

/**
 * Theme configuration for the application.
 */
const theme = createTheme({
  cssVariables: true,
  colorSchemes: { dark: { palette } },
  palette,
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
