import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

import { getTarotReading, type TarotCard } from './functions/_groq'
import { saveReading } from './functions/_db'

// Route /api cho dev server (npm run dev) — khi deploy lên Cloudflare Pages sẽ do functions/api.ts xử lý
const devApi = (apiKey?: string, mongoUrl?: string): Plugin => ({
  name: 'dev-tarot-api',
  configureServer(server) {
    server.middlewares.use('/api', (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        return res.end()
      }
      let raw = ''
      req.on('data', (chunk) => (raw += chunk))
      req.on('end', async () => {
        try {
          if (!apiKey) throw new Error('Chưa cấu hình API_KEY trong file .env')
          const { text, pms, userInfo, topic, detailedQuestion } = JSON.parse(raw) as {
            text: string
            pms: TarotCard[]
            userInfo: {
              name: string
              gender: string | null
              birthDay: string
              birthMonth: string
              birthYear: string
            }
            topic: string
            detailedQuestion: string
          }
          
          const aiResult = await getTarotReading(apiKey, text, pms)
          
          if (mongoUrl) {
            const ipAddress = (req.headers['cf-connecting-ip'] as string) || 
                              (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
                              req.socket.remoteAddress || 
                              '127.0.0.1';
                              
            const birthDate = (userInfo?.birthDay && userInfo?.birthMonth && userInfo?.birthYear)
              ? `${userInfo.birthDay}/${userInfo.birthMonth}/${userInfo.birthYear}`
              : null;
              
            await saveReading(mongoUrl, {
              name: userInfo?.name || '',
              gender: userInfo?.gender || null,
              birthDate,
              topic,
              question: detailedQuestion || text,
              cards: pms,
              aiResult,
              ipAddress
            }).catch(err => console.error('Lỗi khi lưu vào MongoDB (local dev):', err))
          }

          res.setHeader('content-type', 'text/plain; charset=utf-8')
          res.end(aiResult)
        } catch (e) {
          res.statusCode = 500
          res.end(`Luận giải thất bại: ${e instanceof Error ? e.message : e}`)
        }
      })
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [vue(), devApi(env.API_KEY, env.MONGO_URL)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: { host: '0.0.0.0', port: 9121, allowedHosts: ["tarot.xichanh.online"] },
    preview: { host: '0.0.0.0', port: 9121, allowedHosts: ["tarot.xichanh.online"] },
  }
})
