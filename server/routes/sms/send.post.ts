import { smsService } from '~~/server/services/smsService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return smsService.sendSMS(body)
})
