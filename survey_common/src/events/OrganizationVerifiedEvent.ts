import { UserRoles } from "../UserRoles";
import { Subjects } from "./Subjects";


export interface OrganizationVerifiedEvent {
    subject: Subjects.ORGANIZATION_VERIFIED
    data: {
        id: string
        name: string;
        email: string;
        role: UserRoles;
        isVerified: boolean
        version: number
    }
}