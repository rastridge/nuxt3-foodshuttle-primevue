import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)
dayjs.extend(timezone)
dayjs.extend(utc)
// OTHER PLUGINS

export default defineNuxtPlugin(() => {
	return {
		provide: {
			dayjs,
		},
	}
})
