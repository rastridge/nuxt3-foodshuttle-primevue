import { usersService } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id
	return usersService.deleteOne(id)
})
