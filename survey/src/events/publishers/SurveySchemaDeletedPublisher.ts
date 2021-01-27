import { Publisher, Subjects, SurveySchemaDeletedEvent } from "@dabra/survey_common";

export class SurveySchemaDeletedPublisher extends Publisher<SurveySchemaDeletedEvent> {
    subject: Subjects.SURVEY_SCHEMA_DELETED = Subjects.SURVEY_SCHEMA_DELETED
}