import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

async function getMongoClient(mongoUrl: string) {
  if (!client) {
    client = new MongoClient(mongoUrl)
    await client.connect()
  }
  return client
}

export interface ReadingData {
  name: string
  gender: string | null
  birthDate: string | null
  topic: string
  question: string
  cards: { no: number; isReversed: boolean }[]
  aiResult?: string
  ipAddress: string
}

/**
 * Lưu thông tin bói bài Tarot của người dùng cùng với địa chỉ IP và kết quả của AI.
 * Kết nối và lưu vào database 'Tarot', collection 'readings'.
 */
export async function saveReading(mongoUrl: string, data: ReadingData) {
  try {
    const client = await getMongoClient(mongoUrl)
    const db = client.db('Tarot')
    const collection = db.collection('readings')
    
    const record = {
      ...data,
      createdAt: new Date()
    }
    
    const result = await collection.insertOne(record)
    return result.insertedId.toString()
  } catch (error) {
    console.error('Lỗi khi lưu vào MongoDB:', error)
    throw error
  }
}
