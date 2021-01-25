import { AdminCreatedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class AdminCreatedPublisher extends Publisher<AdminCreatedEvent> {
    subject: Subjects.ADMIN_CREATED = Subjects.ADMIN_CREATED
}