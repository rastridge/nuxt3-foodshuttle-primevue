// import querystring from 'querystring'
// import https from 'https'
const { EE_API_KEY } = useRuntimeConfig()

export default function useEmail() {
	const name = ref('joseph')

	const sendByElasticEmail = function (email) {
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
		const post_req = https.request(post_options, function (res) {
			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				result = chunk
				const { statusCode, statusMessage, headers } = res
			})
			res.on('error', function (e) {
				result = 'Error: ' + e.message
			})
		})

		post_req.write(post_data)
		post_req.end()
	}
	return {
		name,
		sendByElasticEmail,
	}
}
