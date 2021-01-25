import { Subjects } from "./Subjects";


export interface SurveySchemaCreadedEvent {
    subject: Subjects.SURVEY_SCHEMA_CREATED
    data: {
        id: string
        title: string;
        description: string;
        creator: { type: "ORGANIZATION" | "ADMIN", id: string } 
        version: number
    }
}