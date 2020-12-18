import { UserRoles } from '@dabra/survey_common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrganizationAttr {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
}

interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
	build(attrs: OrganizationAttr): OrganizationDoc;
}

interface OrganizationDoc extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
}

const organizationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		passord: { type: String, required: true },
		role: { type: String, required: true },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
			},
		},
	}
);

organizationSchema.set('versionKey', 'version');

organizationSchema.plugin(updateIfCurrentPlugin);

organizationSchema.statics.build = (attrs: OrganizationAttr) => {
	return new Organization(attrs);
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
	'Organization',
	organizationSchema
);

export default Organization;
