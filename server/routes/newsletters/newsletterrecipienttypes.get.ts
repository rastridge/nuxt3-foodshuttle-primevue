import { newslettersService } from '~~/server/services/newslettersService'

export default defineEventHandler((event) => {
	return newslettersService.getRecipientTypes()
})
