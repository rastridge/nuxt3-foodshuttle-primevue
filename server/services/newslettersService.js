import mysql from 'mysql2/promise'
import querystring from 'querystring'
import https from 'https'

const {
	DB_DATABASE,
	DB_PASSWORD,
	DB_USER,
	DB_HOST,
	FROM,
	FROM_NAME,
	EE_API_KEY,
} = useRuntimeConfig()

async function doDBQuery(sql, inserts) {
	const conn1 = await mysql.createPool({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}
	const [rows, fields] = await conn1.execute(sql)
	await conn1.end()
	return rows
}
export const newslettersService = {
	getAll,
	getYear,
	sendNewsletter,
	trackNewsletter,
	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getRecipientTypes,
}

async function getAll() {
	// console.log('got here')
	const sql = `SELECT
								newsletter_id,
								newsletter_id as id,
								newsletter_recipient_type_id,
								admin_user_id,
								newsletter_subject,
								newsletter_subject as title,
								newsletter_sent as sent_dt,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM
								inbrc_newsletters
							WHERE
								deleted = 0
							ORDER BY dt DESC`

	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function getYear(year) {
	sql = `SELECT
					newsletter_id,
					newsletter_id as id,
					newsletter_recipient_type_id,
					admin_user_id,
					newsletter_subject,
					newsletter_subject as title,
					newsletter_sent as sent_dt,
					status,
					deleted,
					deleted_dt,
					created_dt,
					modified_dt,
					modified_dt as dt
				FROM
					inbrc_newsletters
				WHERE
					deleted = 0
					AND
					YEAR(created_dt) = ${year}
				ORDER BY
          dt DESC`

	const newsletters = await doDBQuery(sql)
	return newsletters
}

async function sendNewsletter({
	newsletter_id,
	newsletter_body_html,
	newsletter_subject,
	newsletter_recipient_type_id,
}) {
	// get all active accounts
	const sql = `SELECT
						a.account_id as id,
						a.account_id,
						member_type_id,
						member_type2_id,
						member_firstname,
						member_lastname,
						CONCAT(member_firstname," ", member_lastname) as title,
						member_year,
						account_email,
						account_email_opening,
						account_textmsg_opening,
						account_addr_street,
						account_addr_street_ext,
						account_addr_city,
						account_addr_state,
						account_addr_country,
						account_addr_postal,
						account_addr_phone,
						newsletter_recipient,
						mail_recipient,
						sms_recipient,
						a.modified_dt,
						a.modified_dt as dt,
						a.status
					FROM inbrc_accounts a
					WHERE deleted = 0
					ORDER BY account_email ASC`
	const accounts = await doDBQuery(sql)
	//
	// filter match member types with recipient types
	//
	function setNewsletterRecipients(accounts, recipient_type_id) {
		function newsletterTypeMemberMatch(recipient_type_id, el) {
			recipient_type_id = parseInt(recipient_type_id)
			const member_type_id = parseInt(el.member_type_id)
			const member_type2_id = parseInt(el.member_type2_id)
			let include = false
			switch (recipient_type_id) {
				// All
				case 1:
					if (
						member_type_id === 2 ||
						member_type_id === 3 ||
						member_type_id === 5 ||
						member_type_id === 6
					)
						include = true
					break
				// active
				case 2:
					if (member_type_id === 2) include = true
					break
				// alumni
				case 3:
					if (member_type_id === 3) include = true
					break
				// sponsor - might also be active player !
				case 4:
					if (member_type_id === 4 || member_type2_id === 4) include = true
					break
				// special
				case 5:
					if (member_type_id === 5) include = true
					break
				// development
				case 6:
					if (member_type_id === 6) include = true
					break
				// local alumni
				case 7:
					if (
						member_type_id === 3 &&
						el.account_addr_postal.indexOf('14') === 0
					)
						include = true
					break
				// pending
				case 9:
					if (member_type_id === 9) include = true
					break
				// other
				case 10:
					if (member_type_id === 10) include = true
					break
				// flag
				case 11:
					if (member_type_id === 11) include = true
					break
				// testing
				case 13:
					if (member_type_id === 13) include = true
					break
				// marked for mail/calendar no donations
				case 14:
					if (
						member_type_id === 3 && // alumni
						el.mail_recipient === 1 && // marked for mail/calendar
						el.donated == 0 // no donations
					)
						include = true
					break
			}
			return el.status && !el.deleted && el.newsletter_recipient && include
		}
		return accounts.filter(function (el) {
			return newsletterTypeMemberMatch(recipient_type_id, el)
		})
	}
	//
	// make recipients list
	//
	const recipientss = setNewsletterRecipients(
		accounts,
		newsletter_recipient_type_id
	)
	const rec_cnt = recipientss.length
	// console.log('recipients = ', recipientss)

	// General initalizations
	//
	// create email html sections
	//
	const BEGIN_HTML = `<!DOCTYPE html>
											<html>
											<head>
											<meta charset='UTF-8'>
											<meta name='viewport' content='width=device-width, initial-scale=1.0' />
											<style>
											html {
															font-size: 12px;
															@media screen and (min-width: 576px) {
																font-size: 14px;
															}
															@media screen and (min-width: 768px) {
																font-size: 16px;
															}
															@media screen and (min-width: 1200px) {
																font-size: 18px;
															}
														}
												.nl-container {	background-color: #FFF;
																				width: 100%;
																				padding-top: 2rem;
																				padding-bottom: 2rem;
																			}
												.nl-banner { width: 100%;
																			padding-top: 0.5rem;
																			padding-bottom: 0.5rem;
																			color: #FFF;
																			background-color: #00D;
																			font-family: Verdana, Geneva, sans-serif;
																			font-weight: bold;
																			font-size: 1rem;
																			text-align: center;
																		}
												.nl-content {
																			width: 80%;
																			padding: 1rem;
																			font-size: 1.5rem;
																		}
												.nl-footer { font-size: 1rem;
																			padding: 1rem;
																		}
												@media screen and (min-width: 576px) {
													.nl-banner {
														padding-top: 1rem;
														padding-bottom: 1rem;
														font-size: 2rem;
												}
												.ql-align-center {	text-align: center;	}
												.ql-align-justify {	text-align: justify;}
												.ql-align-right {	text-align: right;}
											</style>
											</head>
											<body>
												<div class='nl-container'>
													<div class='nl-banner'>
														<h3>Food Shuttle of western New York</h1>
														<h3>Newsletter</h1>
													</div>`

	const NEWSLETTER_END_STYLES = `</div> <!-- container -->
																</body>
																</html>`

	// const TRACKINGPIXEL = `<img src="/newsletters/track?account_id=${recipient.account_id}&newsletter_id=${newsletter_id}" height="1" width="1" alt="" />`
	// const TRACKINGPIXEL = ''

	// console.log('trackingpixel = ', TRACKINGPIXEL)

	function composeEmail(recipient, newsletter_body_html, newsletter_subject) {
		const email = {
			from: FROM,
			fromName: FROM_NAME,
			to: recipient.account_email,
			subject: newsletter_subject,
			body_text: '',
			body_html:
				BEGIN_HTML +
				`<img src="https://fanciful-bavarois-51ef08.netlify.app/newsletters/track?account_id=${recipient.account_id}&newsletter_id=${newsletter_id}" height="1" width="1" alt="" />` +
				newsletter_body_html +
				NEWSLETTER_END_STYLES,
		}
		return email
	}

	const sendEmail = (email) => {
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

		// console.log(' IN sendMail end ')
	}

	//
	// self invoking function, passing the number of iterations as an argument
	// very cute - https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
	// Using recursion
	// Send emails to Elasticemail slowly	//

	;(function myLoop(i) {
		setTimeout(function () {
			//
			console.log(' IN myLoop i, rec_cnt = ', i, rec_cnt)
			const email = composeEmail(
				recipientss[i - 1],
				newsletter_body_html,
				newsletter_subject
			)
			sendEmail(email)
			if (--i) myLoop(i) //  decrement i and call myLoop again if i > 0
		}, 500) // delay 500ms
	})(rec_cnt)
	//
	// log the email send
	//
	const sql2 = `UPDATE inbrc_newsletters
								SET
									newsletter_sent = NOW(),
									newsletter_send = NOW(),
									newsletter_send_complete = NOW(),
									newsletter_send_status = 3,
									newsletter_opened_cnt = 0,
									newsletter_recp_cnt = 0
								WHERE
									newsletter_id = ${newsletter_id}`

	const newsletters = await doDBQuery(sql2)

	return 'all done'
}
//
//
//
async function getOne(id) {
	// console.log('get one id= ', id)

	const sql = `select * from inbrc_newsletters where newsletter_id = ` + id
	const newsletter = await doDBQuery(sql)
	// console.log(newsletter[0])
	return newsletter[0]
}

async function trackNewsletter(query) {
	const conn = await mysql.createPool({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
	})
	console.log('IN trackNewsletter query = ', query)

	try {
		await conn.query('START TRANSACTION')

		// update member last email opened date
		let sql = `UPDATE inbrc_accounts
					SET
						account_email_opening = NOW()
					WHERE
						account_id = ?`

		let inserts = []
		inserts.push(query.account_id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		// Check if Newsletter already logged for this account in _newsletter_openings ?
		sql = `SELECT
							count(*) as cnt
						FROM
							inbrc_newsletter_openings
						WHERE
							newsletter_id = ? AND account_id = ?`

		inserts = []
		inserts.push(query.newsletter_id, query.account_id)
		sql = mysql.format(sql, inserts)
		let [rows, fields] = await conn.execute(sql)
		let cnt = rows[0].cnt

		// IF not already counted as opened
		if (!cnt) {
			sql = `INSERT INTO inbrc_newsletter_openings
							SET
								newsletter_id = ?,
								account_id = ?,
								newsletter_opened_date = NOW()`

			inserts = []
			inserts.push(query.newsletter_id, query.account_id)
			sql = mysql.format(sql, inserts)
			await conn.execute(sql)
		}
		sql = `UPDATE inbrc_newsletters
					SET
						newsletter_opened_cnt = newsletter_opened_cnt + 1
					WHERE
						newsletter_id = ?`

		inserts = []
		inserts.push(query.newsletter_id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		console.log('COMMIT')
		await conn.query('COMMIT')
		await conn.end()
	} catch (e) {
		console.log('ROLLBACK e = ', e)
		await conn.query('ROLLBACK')
		await conn.end()
		return 'Error in sql'
	}

	return `header('Location: /trackingpixel.gif')`
}

async function addOne({
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
}) {
	var sql = `INSERT INTO inbrc_newsletters SET
								newsletter_recipient_type_id = ?,
                admin_user_id = ?,
                newsletter_subject = ?,
                newsletter_body_text = ?,
                newsletter_body_html = ?,
                newsletter_send_status = 0,
								status = 1,
                created_dt = NOW(),
                modified_dt= NOW()`

	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html
	)
	const newsletter = await doDBQuery(sql, inserts)
	return newsletter
}

async function editOne({
	newsletter_id,
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
	newsletter_send_complete,
	newsletter_send_status,
}) {
	var sql = `UPDATE inbrc_newsletters SET
							newsletter_recipient_type_id = ?,
							admin_user_id = ?,
							newsletter_subject = ?,
							newsletter_body_text = ?,
							newsletter_body_html = ?,
							newsletter_sent = ?,
							newsletter_send_complete = ?,
							newsletter_send_status = ?,
							modified_dt= NOW()
						WHERE newsletter_id = ?`
	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		newsletter_send_complete,
		newsletter_send_status,
		newsletter_id
	)
	const newsletter = await doDBQuery(sql, inserts)

	return newsletter
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_newsletters SET deleted=1, deleted_dt= NOW() WHERE newsletter_id = ` +
		id
	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_newsletters SET status = "` +
		status +
		`" WHERE newsletter_id = ` +
		id
	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function getRecipientTypes() {
	const sql = `SELECT * FROM inbrc_newsletter_recipient_types WHERE 1`
	const recipienttypes = await doDBQuery(sql)
	return recipienttypes
}
