import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 修正反白關鍵：設定為相對路徑，確保 GitHub Pages 在子目錄 /matafive/ 下能正確讀取資源
  base: './', 
})