import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QdrantClient } from '@qdrant/js-client-rest'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { EMBEDDING_SIZE } from '../consts'
import { eVectorCollection } from '../types'

@Injectable()
export class VectorDbService implements OnModuleInit {
	private readonly logger = new Logger(VectorDbService.name)
	private client: QdrantClient

	constructor(private config: ConfigService) {
		this.client = new QdrantClient({
			host: this.config.getOrThrow<string>(ENV_VARS.QDRANT_HOST),
			port: this.config.getOrThrow<number>(ENV_VARS.QDRANT_PORT)
		})
	}

	async onModuleInit() {
		for (const collection of Object.values(eVectorCollection)) {
			await this.ensureCollection(collection)
		}
	}

	private async ensureCollection(collectionName: eVectorCollection) {
		const collections = await this.client.getCollections()
		const exists = collections.collections.some((c) => c.name === collectionName)

		if (!exists) {
			this.logger.log(`Creating collection: ${collectionName}`)
			await this.client.createCollection(collectionName, {
				vectors: {
					size: EMBEDDING_SIZE,
					distance: 'Cosine'
				}
			})
		}
	}

	async upsert(collection: eVectorCollection, id: string, vector: number[], payload: any) {
		return this.client.upsert(collection, {
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

	async searchSimilar(collection: eVectorCollection, vector: number[], limit = 3) {
		return this.client.search(collection, {
			vector,
			limit,
			with_payload: true
		})
	}
}
