import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { appConfig, GATEWAY_ROUTES, SERVER_GLOBAL_PREFIX } from '@sentinel-supreme/shared'
import type { Request, Response } from 'express'
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller(GATEWAY_ROUTES.NOTIFICATIONS)
export class NotificationsController {
	@Post(GATEWAY_ROUTES.SEND_NOTIFICATION)
	@UseGuards(JwtAuthGuard)
	proxySend(@Req() req: Request, @Res() res: Response) {
		const proxy = createProxyMiddleware({
			target: appConfig.NOTIFICATION_SERVICE_URL,
			changeOrigin: true,
			pathRewrite: {
				[`^${SERVER_GLOBAL_PREFIX}${GATEWAY_ROUTES.NOTIFICATIONS}`]: `/${SERVER_GLOBAL_PREFIX}${GATEWAY_ROUTES.NOTIFICATIONS}`
			},
			on: {
				proxyReq: fixRequestBody
			}
		})

		proxy(req, res, (err) => {
			if (err) {
				res.status(500).send({ message: 'Proxy Error', error: err.message })
			}
		})
	}
}
