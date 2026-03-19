import { iMachine } from '@sentinel-supreme/shared'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('machines')
export class Machine implements iMachine {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column()
	name!: string

	@Column({ unique: true })
	apiKey!: string

	@Column({ default: true })
	isActive!: boolean

	@CreateDateColumn()
	createdAt!: Date
}
