import { imageService } from '~~/server/services/imageService'

export default defineEventHandler((event) => {
	return imageService.getGallery()
})
