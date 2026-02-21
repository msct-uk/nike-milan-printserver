// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    DNPPrintPath: process.env.DNP_PRINT_PATH,

    public: {
      // cameraDevices: process.env.CAMERA_DEVICES,
    },
  },
});
