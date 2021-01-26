import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface AdminForgotPasswordEvent {
    subject: Subjects.ADMIN_FORGOT_PASSWORD
    data: {
        id: string
        email: string;
        endPoint: string
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}