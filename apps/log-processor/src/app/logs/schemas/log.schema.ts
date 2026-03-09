import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { eLogLevel } from '@sentinel-supreme/shared'

@Schema({ timestamps: true })
export class Log extends Document {
	@Prop({
		required: true,
		type: String,
		enum: Object.values(eLogLevel),
		default: eLogLevel.INFO
	})
	level!: eLogLevel

	@Prop({ required: true })
	message!: string

	@Prop({ required: true })
	service!: string

	@Prop({ type: Object })
	metadata?: Record<string, any>
}

export const LogSchema = SchemaFactory.createForClass(Log)
