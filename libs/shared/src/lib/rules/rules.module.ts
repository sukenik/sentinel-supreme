import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RuleEntity } from './entities/rules.entity'
import { RulesController } from './rules.controller'
import { RulesManagerService } from './rules.service'

@Module({
	imports: [TypeOrmModule.forFeature([RuleEntity])],
	controllers: [RulesController],
	providers: [RulesManagerService],
	exports: [RulesManagerService, TypeOrmModule]
})
export class SharedRulesModule {}
