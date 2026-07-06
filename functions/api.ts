import { getTarotReading, type TarotCard } from './_groq'
import { saveReading } from './_db'

// Cloudflare Pages Function — xử lý POST /api
// Khi deploy, cần đặt các biến môi trường API_KEY (Groq API key) và MONGO_URL (MongoDB connection string)
// trong Cloudflare Dashboard: Workers & Pages → dự án → Settings → Environment variables
export async function onRequestPost({ request, env }: { request: Request; env: { API_KEY?: string; MONGO_URL?: string } }): Promise<Response> {
  try {
    if (!env.API_KEY) return new Response('Chưa cấu hình biến môi trường API_KEY', { status: 500 })
    
    const body = (await request.json()) as { 
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

    const { text, pms, userInfo, topic, detailedQuestion } = body
    
    // Gọi API AI luận giải trước
    const aiResult = await getTarotReading(env.API_KEY, text, pms)
    
    // Lưu thông tin vào MongoDB nếu đã cấu hình MONGO_URL
    if (env.MONGO_URL) {
      const ipAddress = request.headers.get('cf-connecting-ip') || 
                        request.headers.get('x-real-ip') || 
                        '127.0.0.1'
                        
      const birthDate = (userInfo?.birthDay && userInfo?.birthMonth && userInfo?.birthYear)
        ? `${userInfo.birthDay}/${userInfo.birthMonth}/${userInfo.birthYear}`
        : null
        
      await saveReading(env.MONGO_URL, {
        name: userInfo?.name || '',
        gender: userInfo?.gender || null,
        birthDate,
        topic,
        question: detailedQuestion || text,
        cards: pms,
        aiResult,
        ipAddress
      }).catch((err) => console.error('Lỗi khi lưu vào MongoDB (production):', err))
    }
    
    return new Response(aiResult)
  } catch (e) {
    return new Response(`Luận giải thất bại: ${e instanceof Error ? e.message : e}`, { status: 500 })
  }
}

