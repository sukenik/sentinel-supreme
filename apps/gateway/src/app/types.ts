import { iBaseMachine, iRequestUser } from '@sentinel-supreme/shared'
import { Request } from 'express'

export interface iRequestWithMetadata extends Request {
	user?: iRequestUser
	machine?: iBaseMachine
}
