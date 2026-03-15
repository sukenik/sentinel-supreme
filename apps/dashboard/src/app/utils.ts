import { eLogLevel } from '@sentinel-supreme/shared'

export const getLevelColor = (level: eLogLevel) => {
	switch (level.toLowerCase()) {
		case eLogLevel.ERROR:
			return 'bg-red-900/40 text-red-400'
		case eLogLevel.WARN:
			return 'bg-yellow-900/40 text-yellow-400'
		case eLogLevel.DEBUG:
			return 'bg-purple-900/40 text-purple-400'
		default:
			return 'bg-green-900/40 text-green-400'
	}
}
