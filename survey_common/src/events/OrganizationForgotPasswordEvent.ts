import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface OrganizationForgotPasswordEvent {
    subject: Subjects.ORGANIZATION_FORGET_PASSWORD
    data: {
        id: string
        email: string;
        endPoint: string
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}