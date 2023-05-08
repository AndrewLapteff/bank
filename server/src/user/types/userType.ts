import { Users } from "@prisma/client"

export type UserType = Users & { token?: string } 