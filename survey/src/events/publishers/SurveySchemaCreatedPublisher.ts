import { Publisher, Subjects, SurveySchemaCreadedEvent } from "@dabra/survey_common";

export class SurveySchemaCreatedPublisher extends Publisher<SurveySchemaCreadedEvent> {
    subject: Subjects.SURVEY_SCHEMA_CREATED = Subjects.SURVEY_SCHEMA_CREATED
}