import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      svgLoader(),
      VueI18nPlugin({
        runtimeOnly: false,
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/libs/i18n/locales/**')
      }),
      Components({
        resolvers: [PrimeVueResolver()]
      })
    ],
    base: command === 'serve' ? '' : '',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
