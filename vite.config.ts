import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Capacitor APK 빌드를 위해 base를 './'로 설정 (상대경로)
  // 기존 웹 배포 시에는 '/'로 되돌리거나 환경변수로 분기 가능
  base: './',
  build: {
    outDir: 'dist',
    // 샤오미 패드7 (Android WebView) 호환성을 위한 타겟 설정
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'leaflet': ['leaflet'],
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
