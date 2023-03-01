import { imageService } from '~~/server/services/imageService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id
	return imageService.getOne(id)
})
