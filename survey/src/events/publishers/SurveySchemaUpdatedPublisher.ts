import { Publisher, Subjects, SurveySchemaUpdatedEvent } from "@dabra/survey_common";

export class SurveySchemaUpdatedPublisher extends Publisher<SurveySchemaUpdatedEvent> {
    subject: Subjects.SURVEY_SCHEMA_UPDATED = Subjects.SURVEY_SCHEMA_UPDATED
}