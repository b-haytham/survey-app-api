import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


type SurveyDataType = {
    question: string
    answer: string[]
}[]   


interface SurveyDataAttr {
    surveySchemaId: string
    userId: string
    data: SurveyDataType
}

interface SurveyDataModel extends mongoose.Model<SurveyDataDoc> {
	build(attrs: SurveyDataAttr): SurveyDataDoc;
}

interface SurveyDataDoc extends mongoose.Document {
    surveySchemaId: string
    userId: string
    data: SurveyDataType
}

const surveyDataSchema = new mongoose.Schema(
	{
		surveySchemaId: { type: Schema.Types.ObjectId, required: true, ref: 'SurveySchema' },
		userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		data: [ 
            { 
                question: { type: String, required: true },
                answer: [ String ] 
            } 
        ]
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

surveyDataSchema.set('versionKey', 'version');

surveyDataSchema.plugin(updateIfCurrentPlugin);


surveyDataSchema.statics.build = (attrs: SurveyDataAttr) => {
	return new SurveyData(attrs);
};

const SurveyData = mongoose.model<SurveyDataDoc, SurveyDataModel>(
	'SurveyData',
	surveyDataSchema
);

export default SurveyData;
