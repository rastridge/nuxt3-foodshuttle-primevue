import { contentService } from '~~/server/services/contentService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return contentService.changeStatus(body)
})
