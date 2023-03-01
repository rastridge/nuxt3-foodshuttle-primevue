import mysql from 'mysql2/promise'
import twilio from 'twilio'
const {
	DB_DATABASE,
	DB_PASSWORD,
	DB_USER,
	DB_HOST,
	TWILIO_NUMBER,
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
} = useRuntimeConfig()

async function doDBQuery(sql, inserts) {
	const CONN = await mysql.createPool({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}
	// console.log('doDBQuery sql = ', sql)
	const [rows, fields] = await CONN.execute(sql)
	await CONN.end()
	return rows
}

export const smsService = {
	getAll,
	sendSMS,
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
								sms_id,
								sms_id as id,
								admin_user_id,
								sms_member_type_id ,
								sms_recipient_type_id,
								sms_subject,
								sms_subject as title,
								sms_body_text,
								sms_sent as sent_dt,
								sms_send_complete,
								sms_recp_cnt,
								sms_err_cnt,
								sms_send_status,
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

	const result = await doDBQuery(sql)
	return result
}

async function sendSMS({ sms_id, sms_body_text, sms_recipient_type_id }) {
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
	//

	//
	// make recipients list
	//
	function setSMSRecipients(accounts, recipient_type_id) {
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

	// filter match member types with recipient types
	const sms_recipients = setSMSRecipients(accounts, sms_recipient_type_id)
	const rec_cnt = sms_recipients.length

	const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

	sms_recipients.forEach(function (recipient) {
		const msg = client.messages.create({
			from: TWILIO_NUMBER,
			to: recipient.account_addr_phone,
			body: sms_body_text,
			// statusCallback: `/sms/MessageStatus`,
		})
	})

	const sql2 = `UPDATE inbrc_sms
						SET
							sms_send_status = 3,
							sms_sent = NOW(),
							sms_send_complete = NOW(),
							sms_recp_cnt = ${rec_cnt}
						WHERE sms_id = ${sms_id}`

	const sms = await doDBQuery(sql2)
	return sms
}
//
//
//
async function getOne(id) {
	const sql = `select * from inbrc_sms where sms_id = ` + id
	const result = await doDBQuery(sql)
	return result[0]
}

async function trackNewsletter(query) {
	const conn = await mysql.createPool({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
	})
	console.log('IN trackNewsletter query = ', query)
}

async function addOne({
	sms_recipient_type_id,
	admin_user_id,
	sms_subject,
	sms_body_text,
}) {
	var sql = `INSERT INTO inbrc_sms SET
								sms_recipient_type_id = ?,
                admin_user_id = ?,
                sms_subject = ?,
                sms_body_text = ?,
                sms_send_status = 0,
								status = 1,
                created_dt = NOW(),
                modified_dt= NOW()`

	var inserts = []
	inserts.push(sms_recipient_type_id, admin_user_id, sms_subject, sms_body_text)
	const sms = await doDBQuery(sql, inserts)
	return sms
}

async function editOne({
	sms_id,
	sms_recipient_type_id,
	admin_user_id,
	sms_subject,
	sms_body_text,
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
		sms_id
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
	const sql = `SELECT * FROM inbrc_newsletter_recipient_types WHERE 1`
	const result = await doDBQuery(sql)
	return result
}
