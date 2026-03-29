import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, iReputationData } from '@sentinel-supreme/shared'
import axios from 'axios'

@Injectable()
export class ExternalApiService {
	private readonly logger = new Logger(ExternalApiService.name)
	private readonly apiKey: string

	constructor(private configService: ConfigService) {
		this.apiKey = this.configService.getOrThrow<string>(ENV_VARS.VIRUSTOTAL_API_KEY)
	}

	async getIpReputation(ip: string): Promise<iReputationData> {
		if (ip === '::1' || ip === '127.0.0.1') {
			return { maliciousCount: 0, network: 'localhost' }
		}

		try {
			this.logger.log(`🔍 Checking reputation for IP: ${ip}`)

			const response = await axios.get(
				`https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
				{
					headers: { 'x-apikey': this.apiKey }
				}
			)

			const maliciousCount = response.data.data.attributes.last_analysis_stats.malicious || 0
			const network = response.data.data.attributes.as_owner || 'Unknown Network'

			return {
				maliciousCount,
				network
			}
		} catch (error) {
			const { message } = error as { message: string }
			this.logger.error(`❌ Failed to fetch reputation for ${ip}: ${message}`)
			return { maliciousCount: 0, network: 'error' }
		}
	}
}
