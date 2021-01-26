import {  OrganizationForgotPasswordEvent, Publisher, Subjects } from "@dabra/survey_common";

export class OrganizationForgotPasswordPublisher extends Publisher<OrganizationForgotPasswordEvent> {
    subject: Subjects.ORGANIZATION_FORGET_PASSWORD = Subjects.ORGANIZATION_FORGET_PASSWORD
}