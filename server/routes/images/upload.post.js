import { imageService } from '~~/server/services/imageService'
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	console.log('IN ===== upload.post')
	return imageService.upLoad(event.node.req)
})
