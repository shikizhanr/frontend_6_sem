import { defineConfig } from '#q-app'

export default defineConfig((ctx) => ({
  boot: ['error-handler'],
  css: ['app.scss'],
  extras: ['material-icons'],
  build: {
    target: { browser: ['esnext'], node: 'node22' },
    vueRouterMode: 'history',
    publicPath: ctx.prod ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'quasar-todo-practices'}/` : '/',
    sourcemap: false,
    minify: 'oxc',
    env: {
      clientPrefix: 'VITE_',
      file: ctx.dev ? '.env.development' : '.env.production'
    }
  },
  devServer: {
    open: false,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  },
  framework: {
    config: {
      brand: { primary: '#6657d9', secondary: '#18233f', accent: '#ff7a68', positive: '#20a779' },
      notify: { position: 'top-right', timeout: 2500 }
    },
    plugins: ['Notify', 'Dialog', 'LocalStorage']
  },
  animations: ['fadeIn', 'fadeOut', 'slideInRight', 'slideOutRight']
}))
