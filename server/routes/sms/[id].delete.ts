import { smsService } from '~~/server/services/smsService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.node.req.headers

	const id = event.context.params.id
	return smsService.deleteOne(id)
})
