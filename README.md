# Tarot-Web 🔮 - Trợ lý luận giải Tarot thông minh bằng AI

Tarot-Web là một ứng dụng bói bài Tarot hiện đại, kết hợp vẻ đẹp huyền bí của các lá bài truyền thống với sức mạnh phân tích sâu sắc của trí tuệ nhân tạo (AI). Ứng dụng mang lại trải nghiệm mượt mà, huyền ảo, giúp người dùng tự chiêm nghiệm, tìm kiếm định hướng và giải đáp các câu hỏi trong cuộc sống.

---

## ✨ Các Tính Năng Nổi Bật

- 🌌 **Hành Trình Onboarding Cá Nhân Hóa (5 Scene):** Thu thập các thông tin cơ bản (Tên, giới tính, ngày sinh) và lựa chọn chủ đề băn khoăn (Tình yêu, Sự nghiệp, Tài chính, Sức khỏe, Mối quan hệ, Tương lai).
- 🔀 **Nghi Thức Xáo Bài Tương Tác:** Trải nghiệm hoạt họa xáo bài sinh động, sử dụng thuật toán xáo bài Fisher-Yates để sắp đặt ngẫu nhiên thứ tự thật của bộ bài.
- 🃏 **Rút Bài Tự Do:** Rút 3 lá bài từ bộ 22 lá Ẩn Chính (Major Arcana), hỗ trợ cả hai chiều xuôi (upright) và ngược (reversed).
- 🤖 **Luận Giải Bằng AI Thực Tế:** Gọi API từ Groq (sử dụng mô hình `llama-3.3-70b-versatile` mạnh mẽ) để giải nghĩa chi tiết dựa trên thông tin cá nhân và 3 lá bài bạn đã rút.
- 💾 **Lưu Trữ Kết Quả (MongoDB):** Tích hợp ghi lại lịch sử bói bài (bao gồm IP, kết quả luận giải, lá bài đã rút) vào MongoDB khi cấu hình.
- 🎨 **Thiết Kế Huyền Bí & Cao Cấp:** Giao diện tối (Dark Mode) được thiết kế theo phong cách glassmorphism, kết hợp hiệu ứng xòe bài hình quạt bắt mắt và hiệu ứng chữ gõ tự động sinh động.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** Vue 3 (Composition API / Script Setup), TypeScript, Vite, Tailwind CSS, Less, Radix Vue, Typed.js
- **Serverless/Backend:** Cloudflare Pages Functions
- **AI Engine:** Groq API (`llama-3.3-70b-versatile`)
- **Database:** MongoDB (tùy chọn)

---

## 💻 Hướng Dẫn Phát Triển Cục Bộ (Local Development)

### 1. Chuẩn Bị
Yêu cầu hệ thống cài đặt sẵn Node.js (v18 trở lên) và npm / pnpm.

### 2. Cài Đặt
```bash
# Clone dự án về máy
git clone <URL_DỰ_ÁN>
cd Tarot-Web

# Cài đặt thư viện
npm install
# hoặc nếu dùng pnpm:
pnpm install
```

### 3. Cấu Hình Biến Môi Trường (Environment Variables)
Tạo file `.env` tại thư mục gốc của dự án và điền các thông tin sau:
```env
# API Key của Groq (bắt buộc)
API_KEY=your_groq_api_key_here

# Chuỗi kết nối MongoDB (tùy chọn để lưu lịch sử)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

### 4. Chạy Dự Án Cục Bộ
```bash
npm run dev
```
Dự án sẽ chạy tại địa chỉ mặc định `http://localhost:9121`. Dev server của Vite đã được cấu hình proxy/mock để tự xử lý route `/api` cục bộ bằng cách gọi trực tiếp Groq & MongoDB từ cấu hình `.env` của bạn.

---

## 🚀 Triển Khai Lên Cloudflare Pages (Production Deploy)

Dự án được tối ưu hóa hoàn hảo để chạy trên **Cloudflare Pages** thông qua Cloudflare Pages Functions.

### Các bước triển khai:

1. **Kết nối Git:**
   - Liên kết dự án của bạn trên GitHub/GitLab với Cloudflare Pages.
2. **Cấu hình Build:**
   - **Framework preset:** `Vue`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Cấu hình Biến Môi Trường trên Dashboard Cloudflare:**
   Truy cập vào **Settings** -> **Environment variables** của dự án trên Pages và thêm:
   - `API_KEY`: API Key của Groq (Bắt buộc).
   - `MONGO_URL`: Link kết nối tới MongoDB của bạn (Không bắt buộc).
4. **Nhấn Lưu và Triển Khai (Save and Deploy).** Cloudflare Pages sẽ tự động kích hoạt Cloudflare Functions xử lý endpoint `/api` (từ tệp `/functions/api.ts`).

---

## 📝 Giấy Phép & Đóng Góp

Dự án được mở rộng và phát triển từ mẫu Tarot-Web mã nguồn mở. Mọi đóng góp chỉnh sửa hoặc báo lỗi (Issues & Pull Requests) đều được chào đón!
