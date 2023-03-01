import { smsService } from '~~/server/services/smsService'

export default defineEventHandler((event) => {
	return smsService.getAll()
})
