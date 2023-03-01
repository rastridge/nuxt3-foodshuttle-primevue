import { newsService } from '~~/server/services/newsService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id
	return newsService.getOne(id)
})
