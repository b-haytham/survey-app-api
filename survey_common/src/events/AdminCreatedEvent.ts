import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface AdminCreatedEvent {
    subject: Subjects.ADMIN_CREATED
    data: {
        id: string
        name: string;
        email: string;
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}