import { UserRoles } from '@dabra/survey_common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Password } from '../utils/Password'


interface AdminAttr {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	isVerified: boolean
}

interface AdminModel extends mongoose.Model<AdminDoc> {
	build(attrs: AdminAttr): AdminDoc;
}

interface AdminDoc extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	isVerified: boolean
}

const adminSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		isVerified: { type: Boolean, required: true },
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

adminSchema.set('versionKey', 'version');

adminSchema.plugin(updateIfCurrentPlugin);

adminSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hash = await Password.hash(this.get('password'));
		this.set('password', hash);
	}
	done();
})

adminSchema.statics.build = (attrs: AdminAttr) => {
	return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>(
	'Admin',
	adminSchema
);

export default Admin;
