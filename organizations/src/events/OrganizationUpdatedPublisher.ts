import { OrganizationUpdatedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class OrganizationUpdatedPublisher extends Publisher<OrganizationUpdatedEvent> {
    subject: Subjects.ORGANIZATION_UPDATED = Subjects.ORGANIZATION_UPDATED
}