const EE_API_KEY = useRuntimeConfig()
const { $dayjs } = useNuxtApp()

export default function sendByElasticEmail(email) {
	console.log('IN sendbyelasticemail email = ', email)
	/* 
	// Single email - script from ElasticEmail
	const post_data = querystring.stringify({
		api_key: EE_API_KEY,
		subject: email.subject,
		from: email.from,
		from_name: email.from_name,
		to: email.to,
		// to: "rfa@me.com",
		body_html: email.body_html,
		body_text: email.body_text,
		isTransactional: true,
	})

	const post_options = {
		hostname: 'api.elasticemail.com',
		path: '/v2/email/send',
		port: '443',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length,
		},
	}

	let result = ''
	// Create the request object.
	const post_req = https.request(post_options, function (res) {
		const requestStart = $dayjs().format()
		res.setEncoding('utf8')
		res.on('data', function (chunk) {
			result = chunk
			const { statusCode, statusMessage, headers } = res

			activityLog(
				"sendNewsletter",
				'',
				'----- ' + requestStart + ' ' + statusCode + ' ' + statusMessage + ' ' +
				'SUBJECT ' + email.subject + ' ' +
				'EMAIL ' + email.to + ' ' +
				headers
			)

			activityLog(
				"sendNewsletter",
				'',
				'STATUS CODE= ' + statusCode +
				' REQ START= ' + requestStart +
				' SUBJECT= ' + email.subject +
				' EMAIL= ' + email.to + ' ' +
				' HEADERS= ' +
				JSON.stringify({
					headers
				})
			)
		})
		res.on('error', function (e) {
			result = 'Error: ' + e.message
			/* 			activityLog(
				'sendNewsletter',
				'in https.request res.on(error',
				'time ' +
					moment().format('MMMM Do YYYY, h:mm:ss') +
					' email ' +
					email.to +
					'==error===' +
					result
			)
		})
	})

	post_req.write(post_data)
	post_req.end()
 */
}
