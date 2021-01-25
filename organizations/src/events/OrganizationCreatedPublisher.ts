import { OrganizationCreatedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class OrganizationCreatedPublisher extends Publisher<OrganizationCreatedEvent> {
    subject: Subjects.ORGANIZATION_CREATED = Subjects.ORGANIZATION_CREATED
}