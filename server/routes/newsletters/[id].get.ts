import { newslettersService } from '~~/server/services/newslettersService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id

	return newslettersService.getOne(id)
})
