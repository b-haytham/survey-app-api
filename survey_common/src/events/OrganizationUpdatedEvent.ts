import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface OrganizationUpdatedEvent {
    subject: Subjects.ORGANIZATION_UPDATED
    data: {
        id: string
        name: string;
        email: string;
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}