import { Users } from "@prisma/client"
import { UserType } from "./userType"

export interface UserResponse {
  user: UserType
}