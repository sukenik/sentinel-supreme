import { eRuleOperator, eRuleType, eSeverity, tRule } from '@sentinel-supreme/shared'
import { useForm } from 'react-hook-form'
import { useRuleStore } from '../store/useRuleStore'

export const useRuleForm = (initialData: tRule | undefined, onClose: () => void) => {
	const { addRule, updateRule } = useRuleStore()

	const methods = useForm<tRule>({
		defaultValues: initialData || {
			description: '',
			type: eRuleType.STATIC,
			operator: eRuleOperator.EQUALS,
			severity: eSeverity.MEDIUM,
			isActive: true
		}
	})

	const onSubmit = async (data: tRule) => {
		const payload = { ...data }

		if (payload.type === eRuleType.RATE_LIMIT) {
			payload.limit = Number(payload.limit)
			payload.windowSeconds = Number(payload.windowSeconds)
		}

		if (initialData?.id) {
			Reflect.deleteProperty(payload, 'id')
			await updateRule(initialData.id, payload)
		} else {
			await addRule(payload)
		}

		onClose()
	}

	return {
		methods,
		onSubmit,
		selectedType: methods.watch('type'),
		selectedOperator: methods.watch('operator')
	}
}
