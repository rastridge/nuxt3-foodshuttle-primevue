import { newslettersService } from '~~/server/services/newslettersService'
export default defineEventHandler((event) => {
	const query = getQuery(event)
	console.log('IN track.get query = ', query)
	return newslettersService.trackNewsletter(query)
})
