import { newslettersService } from '~~/server/services/newslettersService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return newslettersService.sendNewsletter(body)
})
