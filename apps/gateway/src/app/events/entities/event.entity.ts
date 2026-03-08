import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('events')
export class SystemEvent {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	type!: string

	@Column('jsonb', { nullable: true })
	payload: any

	@CreateDateColumn()
	createdAt!: Date
}
