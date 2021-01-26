import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface UserForgotPasswordEvent {
    subject: Subjects.USER_FORGOT_PASSWORD
    data: {
        id: string
        email: string;
        endPoint: string
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}