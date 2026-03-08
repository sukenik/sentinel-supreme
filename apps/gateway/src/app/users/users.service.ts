import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>
	) {}

	async create(email: string, pass: string): Promise<User> {
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

	async getByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { email },
			select: ['id', 'email', 'password', 'role']
		})
	}
}
