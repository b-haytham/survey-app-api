import { Publisher, Subjects, SurveyDataCreadedEvent } from "@dabra/survey_common";

export class SurveyDataCreatedPublisher extends Publisher<SurveyDataCreadedEvent> {
    subject: Subjects.SURVEY_DATA_CREATED = Subjects.SURVEY_DATA_CREATED
}