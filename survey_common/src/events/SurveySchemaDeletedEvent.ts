import { Subjects } from "./Subjects";


export interface SurveySchemaDeletedEvent {
    subject: Subjects.SURVEY_SCHEMA_DELETED
    data: {
        id: string
        title: string;
        description: string;
        creator: { type: "ORGANIZATION" | "ADMIN", id: string } 
        version: number
    }
}