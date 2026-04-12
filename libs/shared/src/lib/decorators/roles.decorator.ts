import { SetMetadata } from '@nestjs/common'
import { eUserRole } from '../types'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: eUserRole[]) => SetMetadata(ROLES_KEY, roles)
