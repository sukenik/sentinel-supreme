import { eUserRole, iRegisterUser } from '@sentinel-supreme/shared'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { LoginDto } from './login.dto'

export class RegisterDto extends LoginDto implements iRegisterUser {
	@IsEnum(eUserRole, {
		message: `Role must be one of the following: ${Object.values(eUserRole).join(', ')}`
	})
	@IsNotEmpty({ message: 'User role is required' })
	role!: eUserRole
}
