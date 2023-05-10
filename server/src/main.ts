import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaClient } from '@prisma/client'

export const client = new PrismaClient()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  // app.enableCors()
  await app.listen(3000)
}
bootstrap()
