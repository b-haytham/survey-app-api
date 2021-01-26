import {  AdminForgotPasswordEvent, Publisher, Subjects } from "@dabra/survey_common";

export class AdminForgotPasswordPublisher extends Publisher<AdminForgotPasswordEvent> {
    subject: Subjects.ADMIN_FORGOT_PASSWORD = Subjects.ADMIN_FORGOT_PASSWORD
}