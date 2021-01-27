import { OrganizationDeletedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class OrganizationDeletedPublisher extends Publisher<OrganizationDeletedEvent> {
    subject: Subjects.ORGANIZATION_DELETED = Subjects.ORGANIZATION_DELETED
}