import { Publisher, Subjects, UserUpdatedEvent } from "@dabra/survey_common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
    subject: Subjects.USER_UPDATED = Subjects.USER_UPDATED
}