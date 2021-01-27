import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface AdminDeletedEvent {
    subject: Subjects.ADMIN_DELETED
    data: {
        id: string
        name: string;
        email: string;
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}