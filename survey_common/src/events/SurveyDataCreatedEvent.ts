import { Subjects } from "./Subjects";


export interface SurveyDataCreadedEvent {
    subject: Subjects.SURVEY_DATA_CREATED
    data: {
        id: string
        surveySchemaId: string
        userId: string 
        version: number
    }
}