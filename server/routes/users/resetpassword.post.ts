import { usersService } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	return usersService.resetPassword(body)
})
