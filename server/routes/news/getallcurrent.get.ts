import { newsService } from '~~/server/services/newsService'

export default defineEventHandler((event) => {
	return newsService.getAllCurrent()
})
