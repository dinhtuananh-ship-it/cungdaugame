import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg'],manifest:{name:'Phượng Mệnh – Bí Sử Hậu Cung',short_name:'Phượng Mệnh',description:'Visual novel cung đình tương tác bằng tiếng Việt',theme_color:'#241b21',background_color:'#241b21',display:'standalone',start_url:'/',lang:'vi',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'},{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,woff2}'],navigateFallback:'/index.html'}})],
})
