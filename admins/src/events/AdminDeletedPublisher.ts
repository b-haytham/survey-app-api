import { AdminDeletedEvent, Publisher, Subjects } from "@dabra/survey_common";

export class AdminDeletedPublisher extends Publisher<AdminDeletedEvent> {
    subject: Subjects.ADMIN_DELETED = Subjects.ADMIN_DELETED
}