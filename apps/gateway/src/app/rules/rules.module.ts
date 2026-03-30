import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RuleEntity } from './entities/rules.entity'
import { RulesController } from './rules.controller'
import { RulesGatewayService } from './rules.service'

@Module({
	imports: [TypeOrmModule.forFeature([RuleEntity])],
	controllers: [RulesController],
	providers: [RulesGatewayService],
	exports: [RulesGatewayService]
})
export class RulesModule {}
