import mysql from 'mysql2/promise'

const CONFIG = useRuntimeConfig()

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

export const contentService = {
	getAll,
	getCustomMenuItems,
	getOne,
	editOne,
	addOne,
	deleteOne,
	changeStatus,
}

async function getAll() {
	const sql = `SELECT
					content_id,
					content_id as id,
					content_name,
					content_name as title,
					content_body,
					content_order,
					content_release_dt,
					content_expire_dt,
					status,
					deleted,
					created_dt,
					modified_dt,
					modified_dt as dt
			FROM
					inbrc_content
			WHERE
					deleted = 0
					AND
					status = 1
			ORDER BY
				dt DESC`

	const content = await doDBQuery(sql)
	return content
}

async function getCustomMenuItems() {
	const sql = `SELECT
									content_id,
									content_name
							FROM
									inbrc_content
							WHERE
									deleted = 0
									AND
									status = 1
									AND
									content_order != 0
							ORDER BY
									content_order ASC`
	// console.log('IN custommenuitems sql = ', sql)
	const content = await doDBQuery(sql)
	// console.log('IN custommenuitems content = ', content)

	return content
}

async function getOne(id) {
	const sql = `SELECT
                    content_id,
                    content_id as id,
                    content_name,
                    content_body,
                    content_order,
                    content_release_dt,
                    content_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt
                FROM
                    inbrc_content
                WHERE
                    deleted = 0
                    AND
                    content_id = ${id}`
	// console.log('IN getone sql = ', sql)

	const content = await doDBQuery(sql)

	return content[0]
}

async function editOne(item) {
	let sql = `UPDATE inbrc_content
							SET
								content_name = ?,
								content_body = ?,
								content_order = ?,
								content_release_dt = ?,
								content_expire_dt = ?,
								modified_dt= NOW()
							WHERE content_id = ?`

	let inserts = []
	inserts.push(
		item.content_name,
		item.content_body,
		item.content_order,
		item.content_release_dt,
		item.content_expire_dt,
		item.id
	)
	// activityLog('contentservice','inserts= ', inserts)

	const content = await doDBQuery(sql, inserts)

	return content
}

async function addOne(item) {
	let sql = `INSERT INTO inbrc_content
				SET
				content_name = ?,
				content_body = ?,
				content_order = ?,
				content_release_dt = ?,
				content_expire_dt = ?,
				status = 1,
				deleted = 0,
				created_dt = NOW(),
				modified_dt = NOW()`

	let inserts = []
	inserts.push(
		item.content_name,
		item.content_body,
		item.content_order,
		item.content_release_dt,
		item.content_expire_dt
	)
	const content = await doDBQuery(sql, inserts)

	return content
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_content SET deleted = 1, deleted_dt= NOW() WHERE content_id = ` +
		id
	const content = await doDBQuery(sql)
	return content
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_content SET status = "` +
		status +
		`" WHERE content_id = ` +
		id
	const content = await doDBQuery(sql)
	return content
}
