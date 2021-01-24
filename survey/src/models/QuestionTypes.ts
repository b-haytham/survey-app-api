import { QuestionTypesEnum } from '@dabra/survey_common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface QuestionTypesAttr {
	name: QuestionTypesEnum;
}

interface QuestionTypesModel extends mongoose.Model<QuestionTypesDoc> {
	build(attrs: QuestionTypesAttr): QuestionTypesDoc;
}

interface QuestionTypesDoc extends mongoose.Document {
	name: string;
}

const questionTypesSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
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

questionTypesSchema.set('versionKey', 'version');

questionTypesSchema.plugin(updateIfCurrentPlugin);

questionTypesSchema.statics.build = (attrs: QuestionTypesAttr) => {
	return new QuestionType(attrs);
};

const QuestionType = mongoose.model<QuestionTypesDoc, QuestionTypesModel>(
	'Admin',
	questionTypesSchema
);

export default QuestionType;
