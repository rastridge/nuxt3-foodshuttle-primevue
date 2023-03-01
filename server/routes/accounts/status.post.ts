import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	return accountsService.changeStatus(body)
})
