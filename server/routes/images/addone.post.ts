import { imageService } from '~~/server/services/imageService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return imageService.addOne(body)
})
