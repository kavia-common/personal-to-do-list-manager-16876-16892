import { svelteTesting } from "@testing-library/svelte/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

/**
 * Configure Vite with:
 * - SvelteKit plugin
 * - Dev server proxy for API calls: map /api -> VITE_DEV_PROXY_TARGET if provided
 *   This avoids CORS and missing /api in dev environments.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_DEV_PROXY_TARGET; // e.g. http://localhost:4000

  return {
    plugins: [sveltekit()],
    server: {
      host: "0.0.0.0",
      allowedHosts: [".kavia.ai"],
      port: 3000,
      strictPort: true,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      watch: {
        usePolling: true,
      },
      // Proxy API calls in dev to the backend if target is configured
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              // keep /api prefix when forwarding (backend expected to serve under /api)
              // If backend doesn't use /api prefix, uncomment the rewrite below:
              // rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : undefined,
    },
    test: {
      workspace: [
        {
          extends: "./vite.config.ts",
          plugins: [svelteTesting()],

          test: {
            name: "client",
            environment: "jsdom",
            clearMocks: true,
            include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
            exclude: ["src/lib/server/**"],
            setupFiles: ["./vitest-setup-client.ts"],
          },
        },
        {
          extends: "./vite.config.ts",

          test: {
            name: "server",
            environment: "node",
            include: ["src/**/*.{test,spec}.{js,ts}"],
            exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          },
        },
      ],
    },
  };
});
