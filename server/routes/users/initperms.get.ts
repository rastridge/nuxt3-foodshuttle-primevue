import { usersService } from '~~/server/services/usersService'
export default defineEventHandler((event) => {
	return usersService.initPerms()
})
