import mysql from 'mysql2/promise'
const CONFIG = useRuntimeConfig()

// const { doDBQuery } = useQuery()

async function doDBQuery(sql, inserts) {
	const conn1 = await mysql.createPool({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}

	const [rows, fields] = await conn1.execute(sql)
	await conn1.end()
	return rows
}

export const accountsService = {
	getAll,
	getOne,
	addOne,
	editOne,
	changeStatus,
	deleteOne,
	getMemberTypes,
	getMemberAdminTypes,
}

async function getAll() {
	const sql = `SELECT 
									account_id as id,
									account_id,
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
									modified_dt,
									modified_dt as dt,
									status
							FROM inbrc_accounts
							WHERE deleted = 0
							ORDER BY member_lastname ASC`

	const accounts = await doDBQuery(sql)
	return accounts
}

async function getOne(id) {
	const sql = `SELECT *
							FROM inbrc_accounts
							WHERE account_id = ?`
	const accounts = await doDBQuery(sql, [id])
	const account = accounts[0]
	return account
}

/***************************************** */
/*              addOne                     */
/***************************************** */
async function addOne(info) {
	const conn = await mysql.createPool({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})

	try {
		await conn.query('START TRANSACTION')

		// check for existing  email
		let sql = `select *
							from inbrc_accounts
							where deleted = 0`
		const [rows, fields] = await conn.execute(sql)
		const accounts = rows
		const lc_account_email = info.account_email.toLowerCase()
		let account = accounts.find((u) => u.account_email === lc_account_email)
		// console.log('START TRANSACTION')

		if (!account) {
			let sql = `INSERT INTO inbrc_accounts
							SET
									account_email = ?,
									member_firstname = ?,
									member_lastname = ?,

									member_year = ?,
									account_addr_street = ?,
									account_addr_street_ext = ?,
									account_addr_city = ?,
									account_addr_state = ?,
									account_addr_country = ?,
									account_addr_postal = ?,
									account_addr_phone = ?,

									member_show_phone = ?,
									member_show_addr = ?,
									newsletter_recipient = ?,
									mail_recipient = ?,
									sms_recipient = ?,

									member_type_id = ?,
									member_type2_id = ?,
									member_admin_type_id = ?,
									member_admin_type2_id = ?,
																	status = 1,

									created_dt = NOW(),
									modified_dt= NOW();`
			const {
				account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id,
			} = info

			let inserts = []
			inserts.push(
				lc_account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id
			)

			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			account = rows

			const id = account.insertId

			const msg =
				'An account for account ' +
				member_firstname +
				' ' +
				member_lastname +
				'  has been created ' +
				' email = ' +
				lc_account_email

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'Foodshuttlewny Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// sendEmail(emaildata)
		} else {
			const msg =
				'An account with email ' + lc_account_email + ' already exists'

			account = { message: msg }
			console.log('EXISTS ', msg)

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'Foodshuttlewny Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('email_data= ', email_data)

			// sendEmail(emaildata)
		}

		await conn.query('COMMIT')
		await conn.end()
		console.log('accountsService addOne COMMIT')
		return account
	} catch (e) {
		await conn.query('ROLLBACK e= ', e)
		await conn.end()
		console.log('accountsService addOne ROLLBACK')
	}
}

/***************************************** */
/*               editOne                   */
/***************************************** */
async function editOne(info) {
	const conn = await mysql.createPool({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})

	try {
		await conn.query('START TRANSACTION')
		console.log('START TRANSACTION')

		// check for  updated email in others
		let sql = `select *
							from inbrc_accounts
							where deleted = 0  AND account_id <> ${info.account_id}`
		const [rows, fields] = await conn.execute(sql)
		const accounts = rows
		const lc_account_email = info.account_email.toLowerCase()
		let account = accounts.find((u) => u.account_email === lc_account_email)
		console.log('got here 1')

		if (!account) {
			console.log('got here 2')

			let sql = `UPDATE inbrc_accounts
							SET
									account_email = ?,
									member_firstname = ?,
									member_lastname = ?,

									member_year = ?,
									account_addr_street = ?,
									account_addr_street_ext = ?,
									account_addr_city = ?,
									account_addr_state = ?,
									account_addr_country = ?,
									account_addr_postal = ?,
									account_addr_phone = ?,

									member_show_phone = ?,
									member_show_addr = ?,
									newsletter_recipient = ?,
									mail_recipient = ?,
									sms_recipient = ?,

									member_type_id = ?,
									member_type2_id = ?,
									member_admin_type_id = ?,
									member_admin_type2_id = ?,
									modified_dt= NOW()
								WHERE account_id = ?;`
			const {
				account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id,

				account_id,
			} = info
			console.log('got here 3 ')

			let inserts = []
			inserts.push(
				lc_account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id,

				account_id
			)
			console.log('got here 4 inserts = ', inserts)

			sql = mysql.format(sql, inserts)

			console.log('got here 5 sql = ', sql)

			const [rows, fields] = await conn.execute(sql)
			account = rows
			console.log('got here 5 account = ', account)

			const msg =
				'An account for account ' +
				member_firstname +
				' ' +
				member_lastname +
				'  has been updated ' +
				' email = ' +
				lc_account_email

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'Foodshuttlewny Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// sendEmail(emaildata)
		} else {
			const msg =
				'An account with email ' + lc_account_email + ' already exists'
			account = { message: msg }

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'Foodshuttlewny Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('email_data= ', email_data)
			console.log('EXISTS ', msg)

			// sendEmail(emaildata)
		}

		await conn.query('COMMIT')
		await conn.end()
		console.log('accountsService editOne COMMIT')
		return account
	} catch (e) {
		await conn.query('ROLLBACK e = ', e)
		await conn.end()
		return e
	}
}

async function deleteOne(id) {
	const sql = `UPDATE inbrc_accounts
							SET
									deleted = '1',
									deleted_dt= NOW()
								WHERE account_id = ?;`
	let inserts = []
	inserts.push(id)
	const accounts = await doDBQuery(sql, inserts)
	return accounts
}

async function changeStatus({ id, status }) {
	const sql = `UPDATE inbrc_accounts
							SET
									status = ?,
									deleted_dt= NOW()
								WHERE account_id = ?;`
	let inserts = []
	inserts.push(status, id)
	const accounts = await doDBQuery(sql, inserts)
	return accounts
}

async function getMemberTypes() {
	const sql = `SELECT * FROM inbrc_member_types WHERE 1`
	const membertypes = await doDBQuery(sql)
	return membertypes
}
async function getMemberAdminTypes() {
	const sql = `SELECT * FROM inbrc_member_admin_types WHERE 1`
	const memberadmintypes = await doDBQuery(sql)
	return memberadmintypes
}
