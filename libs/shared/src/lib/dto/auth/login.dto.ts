import { iLoginUser } from '@sentinel-supreme/shared'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto implements iLoginUser {
	@IsEmail({}, { message: 'Please provide a valid email address' })
	@IsNotEmpty()
	email!: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password!: string
}
