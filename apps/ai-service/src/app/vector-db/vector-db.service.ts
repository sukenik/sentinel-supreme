import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QdrantClient } from '@qdrant/js-client-rest'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { EMBEDDING_SIZE } from '../consts'

@Injectable()
export class VectorDbService implements OnModuleInit {
	private readonly logger = new Logger(VectorDbService.name)
	private client: QdrantClient
	private readonly COLLECTION_NAME = 'threat_patterns'

	constructor(private config: ConfigService) {
		this.client = new QdrantClient({
			host: this.config.getOrThrow<string>(ENV_VARS.QDRANT_HOST),
			port: this.config.getOrThrow<number>(ENV_VARS.QDRANT_PORT)
		})
	}

	async onModuleInit() {
		await this.ensureCollection()
	}

	private async ensureCollection() {
		const collections = await this.client.getCollections()
		const exists = collections.collections.some((c) => c.name === this.COLLECTION_NAME)

		if (!exists) {
			this.logger.log(`Creating collection: ${this.COLLECTION_NAME}`)

			await this.client.createCollection(this.COLLECTION_NAME, {
				vectors: {
					size: EMBEDDING_SIZE,
					distance: 'Cosine'
				}
			})
		}
	}

	async upsertThreat(id: string, vector: number[], payload: any) {
		return this.client.upsert(this.COLLECTION_NAME, {
			wait: true,
			points: [
				{
					id,
					vector,
					payload
				}
			]
		})
	}

	async searchSimilarThreats(vector: number[], limit = 3) {
		return this.client.search(this.COLLECTION_NAME, {
			vector,
			limit,
			with_payload: true
		})
	}
}
