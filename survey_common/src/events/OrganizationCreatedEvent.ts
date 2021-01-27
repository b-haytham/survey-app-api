import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface OrganizationCreatedEvent {
    subject: Subjects.ORGANIZATION_CREATED
    data: {
        id: string
        name: string;
        email: string;
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}