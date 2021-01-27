import crypto from 'crypto'
import mongoose from 'mongoose';
import { UserRoles } from '@dabra/survey_common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Password } from '../utils/Password';

interface OrganizationAttr {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	isVerified: boolean
}

interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
	build(attrs: OrganizationAttr): OrganizationDoc;
}

interface OrganizationDoc extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	isVerified: boolean
	resetPasswordToken: string
	resetPasswordExpires: Date
	version: number
}

const organizationSchema = new mongoose.Schema(
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

organizationSchema.set('versionKey', 'version');

organizationSchema.plugin(updateIfCurrentPlugin);

organizationSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hash = await Password.hash(this.get('password'));
		this.set('password', hash);
	}
	done();
})

organizationSchema.statics.build = (attrs: OrganizationAttr) => {
	return new Organization(attrs);
};


export const generatePasswordReset = () => {
   return {
	   resetPasswordToken: crypto.randomBytes(20).toString('hex'),
	   resetPasswordExpires: Date.now() + 3600000 //expires in an hour
   	} 
};


const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
	'Organization',
	organizationSchema
);

export default Organization;
