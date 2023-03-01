import { newsService } from '~~/server/services/newsService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return newsService.changeStatus(body)
})
