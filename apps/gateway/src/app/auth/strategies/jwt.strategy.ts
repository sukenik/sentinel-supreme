import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ENV_VARS, iJwtPayload, JWT_FALLBACK_SECRET } from '@sentinel-supreme/shared'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(ENV_VARS.JWT_SECRET) || JWT_FALLBACK_SECRET
		})
	}

	async validate(payload: iJwtPayload) {
		return { userId: payload.sub, email: payload.email, role: payload.role }
	}
}
