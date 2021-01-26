import { Publisher, Subjects, UserCreatedEvent, UserForgotPasswordEvent } from "@dabra/survey_common";

export class UserForgotPasswordPublisher extends Publisher<UserForgotPasswordEvent> {
    subject: Subjects.USER_FORGOT_PASSWORD = Subjects.USER_FORGOT_PASSWORD
}