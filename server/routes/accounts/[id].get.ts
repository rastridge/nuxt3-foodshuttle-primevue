import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id
	return accountsService.getOne(id)
})
