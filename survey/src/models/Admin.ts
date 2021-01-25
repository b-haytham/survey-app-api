
import { UserRoles } from '@dabra/survey_common';
import mongoose from 'mongoose';


interface AdminAttr {
    adminId: string;
    role: UserRoles
	version: number
	isVerified: boolean
}

interface AdminModel extends mongoose.Model<AdminDoc> {
	build(attrs: AdminAttr): AdminDoc;
}

interface AdminDoc extends mongoose.Document {
    adminId: string
    version: number
	role: UserRoles
	isVerified: boolean
}

const adminSchema = new mongoose.Schema(
	{
        adminId: { type: String, required: true },
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


adminSchema.statics.build = (attrs: AdminAttr) => {
	return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>(
	'Admin',
	adminSchema
);

export default Admin;
