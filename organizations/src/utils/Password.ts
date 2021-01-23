
import bcrypt from 'bcryptjs'

export class Password {
	static async hash(pass: string) {
		const hash = await bcrypt.hash(pass, 10)
		return hash;
	}

	static async compare(storedPass: string, pass: string) {
		const match = await bcrypt.compare(pass, storedPass)
		return match;
	}
}
