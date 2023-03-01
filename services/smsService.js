import mysql from 'mysql2/promise'

const { DB_DATABASE, DB_PASSWORD, DB_USER, DB_HOST, FROM, FROM_NAME } =
	useRuntimeConfig()

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
export const smsService = {
	getAll,
	getYear,
	sendSMS,
	trackSMS,
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
								sms_id,
								sms_id as id,
								sms_recipient_type_id,
								admin_user_id,
								sms_subject,
								sms_subject as title,
								sms_sent as sent_dt,
								sms_body_text,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM
								inbrc_sms
							WHERE
								deleted = 0
							ORDER BY dt DESC`

	const newsletter = await doDBQuery(sql)
	return newsletter
}

async function sendSMS({
	sms_id,
	sms_body_text,
	sms_subject,
	sms_recipient_type_id,
}) {
	//
	// make recipients list
	//
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
						sms_recipient,
						mail_recipient,
						sms_recipient,
						a.modified_dt,
						a.modified_dt as dt,
						a.status
					FROM inbrc_accounts a
					WHERE deleted = 0 AND status = 1
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
			return el.status && !el.deleted && el.sms_recipient && include
		}
		return accounts.filter(function (el) {
			return newsletterTypeMemberMatch(recipient_type_id, el)
		})
	}

	const recipientss = setNewsletterRecipients(accounts, sms_recipient_type_id)
	const rec_cnt = recipientss.length

	const { sendSMS } = useSMS()

	//
	// self invoking function, passing the number of iterations as an argument
	// very cute - https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
	// Using recursion
	// Send emails to Elasticemail slowly	//

	;(function myLoop(i) {
		setTimeout(function () {
			//
			console.log(' IN myLoop i, rec_cnt = ', i, rec_cnt)
			sendSMS(email)
			if (--i) myLoop(i) //  decrement i and call myLoop again if i > 0
		}, 500) // delay 500ms
	})(rec_cnt)
	//
	// log the sms send
	//
	const sql2 = `UPDATE inbrc_sms
								SET
									sms_sent = NOW(),
									sms_send = NOW(),
									sms_send_complete = NOW(),
									sms_send_status = 3,
									sms_opened_cnt = 0,
									sms_recp_cnt = 0
								WHERE
									sms_id = ${sms_id}`

	const result = await doDBQuery(sql2)
	return result
}
//
//
//
async function getOne(id) {
	// console.log('get one id= ', id)

	const sql = `select * from inbrc_sms where sms_id = ` + id
	const result = await doDBQuery(sql)
	return result[0]
}

async function trackSMS(query) {
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

		// Check if Newsletter already logged for this account in _sms_openings ?
		sql = `SELECT
							count(*) as cnt
						FROM
							inbrc_sms_openings
						WHERE
							sms_id = ? AND account_id = ?`

		inserts = []
		inserts.push(query.sms_id, query.account_id)
		sql = mysql.format(sql, inserts)
		let [rows, fields] = await conn.execute(sql)
		let cnt = rows[0].cnt

		// IF not already counted as opened
		if (!cnt) {
			sql = `INSERT INTO inbrc_sms_openings
							SET
								sms_id = ?,
								account_id = ?,
								sms_opened_date = NOW()`

			inserts = []
			inserts.push(query.sms_id, query.account_id)
			sql = mysql.format(sql, inserts)
			await conn.execute(sql)
		}
		sql = `UPDATE inbrc_sms
					SET
						sms_opened_cnt = sms_opened_cnt + 1
					WHERE
						sms_id = ?`

		inserts = []
		inserts.push(query.sms_id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		console.log('COMMIT')
		await conn.commit()
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
	sms_recipient_type_id,
	admin_user_id,
	sms_subject,
	sms_body_text,
	sms_body_html,
}) {
	var sql = `INSERT INTO inbrc_sms SET
								sms_recipient_type_id = ?,
                admin_user_id = ?,
                sms_subject = ?,
                sms_body_text = ?,
                sms_body_html = ?,
                sms_send_status = 0,
								status = 1,
                created_dt = NOW(),
                modified_dt= NOW()`

	var inserts = []
	inserts.push(
		sms_recipient_type_id,
		admin_user_id,
		sms_subject,
		sms_body_text,
		sms_body_html
	)
	const result = await doDBQuery(sql, inserts)
	return result
}

async function editOne({
	id,
	sms_recipient_type_id,
	admin_user_id,
	sms_subject,
	sms_body_text,
	sms_body_html,
	sms_sent,
	sms_send_complete,
	sms_send_status,
}) {
	var sql = `UPDATE inbrc_sms SET
							sms_recipient_type_id = ?,
							admin_user_id = ?,
							sms_subject = ?,
							sms_body_text = ?,
							sms_sent = ?,
							sms_send_complete = ?,
							sms_send_status = ?,
							modified_dt= NOW()
						WHERE sms_id = ?`
	var inserts = []
	inserts.push(
		sms_recipient_type_id,
		admin_user_id,
		sms_subject,
		sms_body_text,
		sms_sent,
		sms_send_complete,
		sms_send_status,
		id
	)
	const result = await doDBQuery(sql, inserts)
	return result
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_sms SET deleted=1, deleted_dt= NOW() WHERE sms_id = ` + id
	const result = await doDBQuery(sql)
	return result
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_sms SET status = "` + status + `" WHERE sms_id = ` + id
	const result = await doDBQuery(sql)
	return result
}

async function getRecipientTypes() {
	const sql = `SELECT * FROM inbrc_sms_recipient_types WHERE 1`
	const recipienttypes = await doDBQuery(sql)
	return recipienttypes
}
