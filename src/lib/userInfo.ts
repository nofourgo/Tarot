import { reactive, ref, computed } from 'vue'

// ===== Thông tin người dùng (thu thập qua hành trình onboarding 5 scene) =====
// Chỉ giữ trong phiên, không lưu trữ lâu dài, không tự gửi lên backend.
export const userInfo = reactive({
  name: '',
  gender: null as string | null,
  birthDay: '',
  birthMonth: '',
  birthYear: '',
})

// Tên hiển thị: nếu người dùng giữ im lặng thì dùng danh xưng mặc định
export const displayName = computed(() => userInfo.name.trim() || 'Người mang thiên mệnh')

// ===== Chủ đề & câu hỏi =====
export interface QuestionCategory {
  id: string
  label: string
  // Câu hỏi mặc định gửi AI nếu người dùng không nhập chi tiết
  question: string
  // Cụm từ dùng trong câu dẫn cá nhân hóa ở Scene 5
  phrase: string
  // Placeholder của ô nhập chi tiết theo từng chủ đề
  placeholder: string
}
export const questionCategories: QuestionCategory[] = [
  { id: 'love', label: '💕 Tình yêu', question: 'Chuyện tình cảm của tôi sẽ phát triển thế nào?', phrase: 'chuyện tình cảm', placeholder: 'Hãy chia sẻ điều bạn đang băn khoăn về tình cảm...' },
  { id: 'career', label: '💼 Sự nghiệp', question: 'Con đường sự nghiệp của tôi sẽ ra sao?', phrase: 'hành trình sự nghiệp', placeholder: 'Hãy chia sẻ điều bạn đang băn khoăn về công việc...' },
  { id: 'money', label: '💰 Tài chính', question: 'Tình hình tài chính của tôi sẽ thế nào?', phrase: 'chuyện tài chính', placeholder: 'Hãy chia sẻ điều bạn muốn biết về tài chính...' },
  { id: 'health', label: '🌿 Sức khỏe', question: 'Sức khỏe của tôi sẽ ra sao trong thời gian tới?', phrase: 'vấn đề sức khỏe', placeholder: 'Hãy chia sẻ điều bạn đang băn khoăn về sức khỏe...' },
  { id: 'relationship', label: '👥 Quan hệ', question: 'Mối quan hệ của tôi với người này sẽ thế nào?', phrase: 'các mối quan hệ', placeholder: 'Hãy chia sẻ điều bạn đang băn khoăn về mối quan hệ này...' },
  { id: 'future', label: '🔮 Tương lai chung', question: 'Điều gì đang chờ đợi tôi phía trước?', phrase: 'hành trình phía trước', placeholder: 'Hãy chia sẻ điều bạn muốn biết về tương lai...' },
]

// Chủ đề đã chọn ở Scene 4 (bắt buộc trước khi vào chọn bài)
export const selectedTopic = ref<string | null>(null)
export const selectedTopicInfo = computed(() => questionCategories.find((c) => c.id === selectedTopic.value) ?? null)

// Câu hỏi chi tiết người dùng nhập ở Scene 5 (không bắt buộc)
export const detailedQuestion = ref('')

// Câu hỏi cuối cùng gửi đi: ưu tiên chi tiết người dùng nhập, nếu không dùng câu mặc định của chủ đề
export const finalQuestion = computed(() => detailedQuestion.value.trim() || selectedTopicInfo.value?.question || '')

// Đã hoàn thành hành trình onboarding hay chưa
export const onboardingCompleted = ref(false)
