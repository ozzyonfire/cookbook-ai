import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [
    redwood(),
    tailwindcss(),
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
  ],
});
