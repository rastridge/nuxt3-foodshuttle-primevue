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

export const newsService = {
	getAll,
	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getAllCurrent,
}

async function getAll() {
	const sql = `SELECT
									news_id,
									news_id as id,
									news_title,
									news_title as title,
									news_event_dt,
									news_event_dt as dt,
									news_expire_dt,
									news_release_dt,
									news_synop,
									status
                FROM
									inbrc_news
                WHERE
									deleted = 0
                ORDER BY dt DESC`

	const news = await doDBQuery(sql)

	return news
}

async function getAllCurrent() {
	const sql = `SELECT
										news_id,
										news_id as id,
										news_title,
										news_title as title,
                    news_event_dt,
                    news_event_dt as dt,
                    news_expire_dt,
                    news_release_dt,
                    status,
                    news_synop,
                    news_article
                FROM
                    inbrc_news
                WHERE
                    deleted = 0
                    AND
                    status = 1
                    AND
                    DATEDIFF( CURDATE(), news_expire_dt)  <=  0

                ORDER BY dt DESC`
	const news = await doDBQuery(sql)
	return news
}

async function getOne(id) {
	const sql =
		`select 
				news_id,
				news_id as id,
				news_title,
				news_title as title,
				news_event_dt,
				news_expire_dt,
				news_release_dt,
				status,
				news_synop,
				news_article
		from inbrc_news
		where news_id = ` + id

	const news = await doDBQuery(sql)

	return news[0]
}

async function addOne({
	news_title,
	news_synop,
	news_article,
	news_event_dt,
	news_release_dt,
	news_expire_dt,
}) {
	var sql = `INSERT INTO inbrc_news SET
								news_title = ?,
								news_synop = ?,
								news_article = ?,
								news_event_dt = ?,
								news_release_dt = ?,
								news_expire_dt = ?,
								created_dt = NOW(),
								modified_dt= NOW()`

	var inserts = []
	inserts.push(
		news_title,
		news_synop,
		news_article,
		news_event_dt,
		news_release_dt,
		news_expire_dt
	)
	const news = await doDBQuery(sql, inserts)

	return news
}

async function deleteOne(id) {
	const sql = `UPDATE inbrc_news SET deleted = 1, deleted_dt = NOW() WHERE news_id = ${id}`
	const news = await doDBQuery(sql)

	return news
}

async function changeStatus({ id, status }) {
	const sql = `UPDATE inbrc_news SET status = ${status} WHERE news_id = ${id}`
	const news = await doDBQuery(sql)

	return news
}

async function editOne({
	id,
	news_title,
	news_synop,
	news_article,
	news_event_dt,
	news_release_dt,
	news_expire_dt,
}) {
	var sql = `UPDATE inbrc_news SET
								news_title = ?,
								news_synop = ?,
								news_article = ?,
								news_event_dt = ?,
								news_release_dt = ?,
								news_expire_dt = ?,
								modified_dt= NOW()
							WHERE news_id = ?`
	var inserts = []
	inserts.push(
		news_title,
		news_synop,
		news_article,
		news_event_dt,
		news_release_dt,
		news_expire_dt,
		id
	)
	const news = await doDBQuery(sql, inserts)

	return news
}
