import { smsService } from '~~/server/services/smsService'
export default defineEventHandler((event) => {
	const query = getQuery(event)
	console.log('IN track.get query = ', query)
	return smsService.trackNewsletter(query)
})
