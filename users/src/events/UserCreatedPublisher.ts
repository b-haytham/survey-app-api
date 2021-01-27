import { Publisher, Subjects, UserCreatedEvent } from "@dabra/survey_common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.USER_CREATED = Subjects.USER_CREATED
}