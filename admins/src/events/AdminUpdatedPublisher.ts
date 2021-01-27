import { AdminUpdatedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class AdminUpdatedPublisher extends Publisher<AdminUpdatedEvent> {
    subject: Subjects.ADMIN_UPDATED = Subjects.ADMIN_UPDATED
}