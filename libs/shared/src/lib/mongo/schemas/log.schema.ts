import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { eLogLevel, iLog } from '../../types'

@Schema({ timestamps: { createdAt: false, updatedAt: true } })
export class Log extends Document implements iLog {
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

	@Prop({ required: true, index: true })
	createdAt!: Date

	@Prop({ type: Object })
	metadata?: Record<string, any>

	@Prop({ type: String, index: true })
	sourceIp?: string
}

export const LogSchema = SchemaFactory.createForClass(Log)

LogSchema.index({ createdAt: -1 })
LogSchema.index({ message: 'text' })
LogSchema.index({ serviceName: 1, createdAt: -1 })
LogSchema.index({ sourceIp: 1, createdAt: -1 })
