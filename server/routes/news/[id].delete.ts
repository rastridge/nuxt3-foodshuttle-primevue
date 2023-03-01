import { newsService } from '~~/server/services/newsService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.node.req.headers

	const id = event.context.params.id
	return newsService.deleteOne(id)
})
