import { usersService } from '~~/server/services/usersService'
import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
	return usersService.getAll()
})
