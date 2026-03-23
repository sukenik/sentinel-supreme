import { eUserRole, UpdateUser } from '@sentinel-supreme/shared'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateDto implements UpdateUser {
	@IsEmail({}, { message: 'Please provide a valid email address' })
	@IsNotEmpty()
	email!: string

	@IsOptional()
	@IsString()
	password?: string

	@IsEnum(eUserRole, {
		message: `Role must be one of the following: ${Object.values(eUserRole).join(', ')}`
	})
	@IsNotEmpty({ message: 'User role is required' })
	role!: eUserRole
}
