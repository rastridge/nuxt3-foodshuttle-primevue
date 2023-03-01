import { contentService } from '~~/server/services/contentService'

export default defineEventHandler((event) => {
	return contentService.getCustomMenuItems()
})
