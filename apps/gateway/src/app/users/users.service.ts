import { ConflictException, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ENV_VARS, eUserRole, iUser } from '@sentinel-supreme/shared'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UsersService implements OnModuleInit {
	private readonly logger = new Logger(UsersService.name)

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<iUser>,
		private readonly config: ConfigService
	) {}

	async onModuleInit() {
		await this.seedAdminUser()
	}

	private async seedAdminUser() {
		const { INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } = ENV_VARS

		const adminEmail = this.config.getOrThrow<string>(INITIAL_ADMIN_EMAIL)
		const adminPassword = this.config.getOrThrow<string>(INITIAL_ADMIN_PASSWORD)

		const existingUser = await this.usersRepository.findOne({ where: { email: adminEmail } })

		if (existingUser) {
			this.logger.log('✅ Admin user already exists.')
			return
		}

		const hashedPassword = await bcrypt.hash(adminPassword, 10)

		const admin = this.usersRepository.create({
			email: adminEmail,
			password: hashedPassword,
			role: eUserRole.ADMIN
		})

		await this.usersRepository.save(admin)
		this.logger.log('🚀 Default admin user created')
	}

	async create(email: string, pass: string): Promise<iUser> {
		const existingUser = await this.usersRepository.findOne({ where: { email } })

		if (existingUser) {
			throw new ConflictException('User already exists')
		}

		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(pass, salt)

		const newUser = this.usersRepository.create({
			email,
			password: hashedPassword
		})

		return this.usersRepository.save(newUser)
	}

	async getByEmail(email: string): Promise<iUser | null> {
		return this.usersRepository.findOne({
			where: { email },
			select: ['id', 'email', 'password', 'role']
		})
	}

	async getAll(): Promise<iUser[]> {
		return this.usersRepository.find({
			order: { createdAt: 'DESC' }
		})
	}

	async deleteById(id: string): Promise<void> {
		this.usersRepository.delete({ id })
	}
}
