
import { UserRoles } from '@dabra/survey_common';
import mongoose from 'mongoose';


interface OrganizationAttr {
    orgId: string;
    role: UserRoles
	version: number
	isVerified: boolean
}

interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
	build(attrs: OrganizationAttr): OrganizationDoc;
}

interface OrganizationDoc extends mongoose.Document {
    orgId: string
    role: UserRoles
	version: number
	isVerified: boolean
}

const organizationSchema = new mongoose.Schema(
	{
        orgId: { type: String, required: true },
        role: { type: String, required: true },
		version: { type: String, required: true },
		isVerified: { type: Boolean, required: true }
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
                delete ret._id;
                delete ret.__v
			},
		},
	}
);


organizationSchema.statics.build = (attrs: OrganizationAttr) => {
	return new Organization(attrs);
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
	'Organization',
	organizationSchema
);

export default Organization;
