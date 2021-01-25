import { QuestionTypesEnum, UserRoles } from '@dabra/survey_common';
import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';



interface SchemaType extends Schema {
    surveySchema: {
        question: { type: QuestionTypesEnum, text: string }
        answer: number[] | string[]
    }[] 
}

interface SurveySchemaAttr {
	title: string;
	description: string;
    creator: { type: "ORGANIZATION" | "ADMIN", id: string }
    schema: SchemaType
    isDraft: boolean
}

interface SurveySchemaModel extends mongoose.Model<SurveySchemaDoc> {
	build(attrs: SurveySchemaAttr): SurveySchemaDoc;
}

interface SurveySchemaDoc extends mongoose.Document {
	title: string;
	description: string;
    creator: { type: "ORGANIZATION" | "ADMIN", orgId?: string, adminId?: string }
    schema: SchemaType
    isDraft: boolean
}

const surveySchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		creator: { 
            type: { type: String, required: true },
            orgId:  { type: Schema.Types.ObjectId, ref: 'Organization' },
            adminId: { type: Schema.Types.ObjectId, ref: 'Admin' }
        },
		schema: {
            surveySchema: [ 
                { 
                    question: {
                        type: { type: String, required: true },
                        text: { type: String, required: true }
                    },
                    answer: [ String ]
                }
            ]
        },
		isDraft: { type: Boolean, required: true },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

surveySchema.set('versionKey', 'version');

surveySchema.plugin(updateIfCurrentPlugin);


surveySchema.statics.build = (attrs: SurveySchemaAttr) => {
	return new SurveySchema(attrs);
};

const SurveySchema = mongoose.model<SurveySchemaDoc, SurveySchemaModel>(
	'SurveySchema',
	surveySchema
);

export default SurveySchema;
