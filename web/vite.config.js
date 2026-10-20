import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  ssr: { noExternal: ["framer-motion", "react-icons", "lenis"] },
});
