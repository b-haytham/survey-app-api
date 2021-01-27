import { Publisher, Subjects, UserDeletedEvent } from "@dabra/survey_common";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
    subject: Subjects.USER_DELETED = Subjects.USER_DELETED
}