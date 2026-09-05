import { check, sleep } from 'k6'
import http from 'k6/http'

export const options = {
	stages: [
		{ duration: '15s', target: 50 },
		{ duration: '30s', target: 150 },
		{ duration: '30s', target: 200 },
		{ duration: '15s', target: 0 }
	],
	thresholds: {
		http_req_duration: ['p(95)<500'],
		http_req_failed: ['rate<0.02']
	}
}

export default function () {
	const API_TOKEN = __ENV.TEST_GATEWAY_API_TOKEN || ''
	const MACHINE_TOKEN = __ENV.TEST_GATEWAY_MACHINE_TOKEN || ''
	const url = 'http://localhost:3000/api/logs/ingest'

	const payload = JSON.stringify({
		level: 'info',
		message: 'bamba',
		service: 'external-service',
		sourceIp: '43.131.232.111',
		metadata: {
			test: true,
			version: '1.0.0'
		},
		createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
	})

	const params = {
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
			'Content-Type': 'application/json',
			'x-api-key': MACHINE_TOKEN
		}
	}

	const res = http.post(url, payload, params)

	check(res, {
		'status is 200 or 201': (r) => r.status === 200 || r.status === 201
	})

	sleep(0.1)
}
