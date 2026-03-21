import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { iRequestUser } from '@sentinel-supreme/shared'
import { iRequestWithMetadata } from '../../types'

export const GetUser = createParamDecorator(
	(data: keyof iRequestUser | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<iRequestWithMetadata>()
		const user = request.user

		return data ? user?.[data] : user
	}
)
