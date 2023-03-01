import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler(async (event) => {
	// const config = useRuntimeConfig()
	// const headers = event.node.req.headers

	const id = event.context.params.id
	return accountsService.deleteOne(id)
})
