import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const users = await prisma.user.findMany()
    console.log('Users:', users)
    console.log('Connection successful!')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

test()