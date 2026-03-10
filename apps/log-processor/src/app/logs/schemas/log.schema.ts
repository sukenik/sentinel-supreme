import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CreateLogDto, eLogLevel } from '@sentinel-supreme/shared'

export interface iLog extends CreateLogDto {
	fingerprint: string
}

@Schema({ timestamps: true })
export class Log extends Document {
	@Prop({
		required: true,
		type: String,
		enum: Object.values(eLogLevel),
		default: eLogLevel.INFO,
		index: true
	})
	level!: eLogLevel

	@Prop({ required: true, unique: true })
	fingerprint!: string

	@Prop({ required: true })
	message!: string

	@Prop({ required: true, index: true })
	service!: string

	@Prop({ default: Date.now })
	createdAt!: Date

	@Prop({ type: Object })
	metadata?: Record<string, any>
}

export const LogSchema = SchemaFactory.createForClass(Log)
LogSchema.index({ createdAt: -1 })
