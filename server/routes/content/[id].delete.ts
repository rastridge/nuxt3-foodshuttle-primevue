import { contentService } from '~~/server/services/contentService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id
	return contentService.deleteOne(id)
})
