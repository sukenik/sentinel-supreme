import { eUserRole, iUser } from '@sentinel-supreme/shared'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User implements iUser {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ unique: true })
	email!: string

	@Column({ select: false })
	password!: string

	@Column({
		type: 'enum',
		enum: eUserRole,
		default: eUserRole.USER
	})
	role!: eUserRole

	@CreateDateColumn()
	createdAt!: Date
}
