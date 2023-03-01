import { newslettersService } from '~~/server/services/newslettersService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.node.req.headers

	const id = event.context.params.id
	return newslettersService.deleteOne(id)
})
