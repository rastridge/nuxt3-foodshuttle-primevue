import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler((event) => {
	return accountsService.getAll()
})
