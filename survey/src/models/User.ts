
import { UserRoles } from '@dabra/survey_common';
import mongoose from 'mongoose';


interface UserAttr {
    userId: string;
    role: UserRoles
	version: number
	isVerified: boolean
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttr): UserDoc;
}

interface UserDoc extends mongoose.Document {
    userId: string
    version: number
	role: UserRoles
	isVerified: boolean
}

const userSchema = new mongoose.Schema(
	{
        userId: { type: String, required: true },
        role: { type: String, required: true },
        version: { type: String, required: true },
		isVerified: { type: Boolean,  required: true }
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


userSchema.statics.build = (attrs: UserAttr) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>(
	'User',
	userSchema
);

export default User;
