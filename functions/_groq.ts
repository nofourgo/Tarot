// Gọi API Groq để luận giải bài Tarot — dùng chung cho Cloudflare Pages Function (functions/api.ts)
// và route /api của Vite dev server (vite.config.ts)
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface TarotCard {
  no: number
  isReversed: boolean
}

export async function getTarotReading(apiKey: string, text: string, pms: TarotCard[]): Promise<string> {
  const body = {
    messages: [
      {
        role: 'system',
        content: `Bây giờ bạn là một bậc thầy Tarot, hãy luận giải câu hỏi dựa trên những lá bài tôi đã chọn, sử dụng 22 lá bài Ẩn Chính (Major Arcana): {"0": "Kẻ Khờ","1": "Nhà Ảo Thuật","2": "Nữ Tư Tế","3": "Hoàng Hậu","4": "Hoàng Đế","5": "Giáo Hoàng","6": "Đôi Tình Nhân","7": "Cỗ Xe","8": "Sức Mạnh","9": "Ẩn Sĩ","10": "Bánh Xe Số Phận","11": "Công Lý","12": "Người Treo Ngược","13": "Thần Chết","14": "Tiết Chế","15": "Ác Quỷ","16": "Tòa Tháp","17": "Ngôi Sao","18": "Mặt Trăng","19": "Mặt Trời","20": "Phán Xét","21": "Thế Giới"}. Tôi sẽ gửi cho bạn các lá bài dưới dạng mảng, trong đó isReversed cho biết lá bài có bị ngược hay không, no là số từ 0 đến 21 tương ứng với 22 lá Ẩn Chính. Khi luận giải, bạn cần thay các số 0-21 bằng tên tương ứng của 22 lá Ẩn Chính. Hãy trả lời hoàn toàn bằng tiếng Việt, chỉ cần giải thích ý nghĩa và luận giải các lá bài, cuối cùng kết thúc bằng tỷ lệ phần trăm thể hiện xác suất của câu hỏi, không cần nói thêm gì khác`,
      },
      {
        role: 'user',
        content: `Mảng các lá bài là: ${JSON.stringify(pms)}, câu hỏi là: '${text}?', hãy giúp tôi luận giải`,
      },
    ],
    stream: false,
    model: GROQ_MODEL,
    temperature: 0,
    presence_penalty: 0,
    frequency_penalty: 0,
    top_p: 1,
  }
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Groq trả về lỗi ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content
}
