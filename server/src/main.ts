import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaClient } from '@prisma/client'
import * as cookieParser from 'cookie-parser'

export const client = new PrismaClient()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ credentials: true, origin: 'http://localhost:5173', allowedHeaders: [ 'Content-Type', 'Authorization' ], methods: [ 'GET', 'PUT', 'POST' ] })
  app.use(cookieParser())
  await app.listen(3000)
}
bootstrap()
