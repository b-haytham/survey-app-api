import crypto from 'crypto'
import mongoose from 'mongoose';
import { UserRoles } from '@dabra/survey_common';
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
	resetPasswordToken?: string
	resetPasswordExpires?: string
	version: number
	generatePasswordReset(): void
}

const adminSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		isVerified: { type: Boolean, required: true },
		resetPasswordToken: { type: String, required: false },
		resetPasswordExpires: { type: Date, required: false }
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


adminSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const Admin = mongoose.model<AdminDoc, AdminModel>(
	'Admin',
	adminSchema
);

export default Admin;
