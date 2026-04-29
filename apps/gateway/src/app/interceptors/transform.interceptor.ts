import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { appConfig } from '@sentinel-supreme/shared'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		const http = context.switchToHttp()
		const request = http.getRequest()

		if (request.url.includes(appConfig.PROMETHEUS_ENDPOINT)) {
			return next.handle()
		}

		return next.handle().pipe(
			map((data) => ({
				success: true,
				data,
				timestamp: new Date().toISOString()
			}))
		)
	}
}
