import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { iBaseMachine } from '@sentinel-supreme/shared'
import { iRequestWithMetadata } from 'src/app/types'

export const GetMachine = createParamDecorator(
	(data: keyof iBaseMachine | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<iRequestWithMetadata>()
		const machine = request.machine

		return data ? machine?.[data] : machine
	}
)
