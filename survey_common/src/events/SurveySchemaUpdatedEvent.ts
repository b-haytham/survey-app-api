import { Subjects } from "./Subjects";


export interface SurveySchemaUpdatedEvent {
    subject: Subjects.SURVEY_SCHEMA_UPDATED
    data: {
        id: string
        title: string;
        description: string;
        creator: { type: "ORGANIZATION" | "ADMIN", id: string } 
        version: number
    }
}