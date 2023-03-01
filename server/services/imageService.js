import formidable from 'formidable'
import path from 'path'
import sharp from 'sharp'
import mysql from 'mysql2/promise'

const CONFIG = useRuntimeConfig()

async function doDBQuery(sql, inserts) {
	const CONN = await mysql.createPool({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})

	if (inserts) {
		sql = mysql.format(sql, inserts)
	}
	const [rows, fields] = await CONN.execute(sql)

	await CONN.end()
	return rows
}

export const imageService = {
	upLoad,
	getAll,
	addOne,
	editOne,
	getOne,
	getGallery,
	deleteOne,
	changeStatus,
}

async function upLoad(req) {
	console.log('IN ===== 1 imageservice upload')

	const data = await new Promise((resolve, reject) => {
		const form = formidable({ multiples: false })
		console.log('IN =====  2 imageservice upload')

		// Only works with Node fetch?
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err)
			}
			if (!files.photo) {
				resolve({
					status: 'error',
					message: 'Upload a photo',
				})
			}

			if (files.photo[0].mimetype.startsWith('image/')) {
				const oldPath = files.photo[0].filepath
				const sharpName =
					Date.now() +
					Math.round(Math.random() * 100000) +
					'_sharped_' +
					files.photo[0].originalFilename
				const newSharpPath = `${path.join('public', 'images', sharpName)}`
				const url = `${path.join('/', 'images', sharpName)}`

				sharp(oldPath)
					.rotate()
					// .resize(400, 300)
					.png({ mozjpeg: true })
					.toFile(newSharpPath)
					.then((data) => {
						resolve({
							status: 'ok',
							url: url,
							width: data.width,
							height: data.height,
						})
					})
			} else {
				resolve({
					status: 'error',
					message: 'Please upload nothing but images.',
				})
			}
			console.log('IN ===== 3 imageservice upload')
		})
	})
	return data
}

async function getAll() {
	const sql = `SELECT
					image_id,
					image_id as id,
					title,
					alt,
					url,
					description,
					gallery,
					status,
					deleted,
					created_dt,
					deleted_dt,
					modified_dt,
					modified_dt as dt
			FROM
					inbrc_images
			WHERE
					deleted = 0
					AND
					status = 1
			ORDER BY
				dt DESC`

	const images = await doDBQuery(sql)
	return images
}

async function addOne(item) {
	let sql = `INSERT INTO inbrc_images
				SET
				title = ?,
				alt = ?,
				url = ?,
				description = ?,
				gallery = ?,
				status = 1,
				deleted = 0,
				created_dt = NOW(),
				modified_dt = NOW()`

	let inserts = []
	inserts.push(item.title, item.alt, item.url, item.description, item.gallery)
	const images = await doDBQuery(sql, inserts)

	return images
}

async function editOne(item) {
	let sql = `UPDATE inbrc_images
							SET
								title = ?,
								alt = ?,
								url = ?,
								description = ?,
								gallery = ?,
								modified_dt= NOW()
							WHERE image_id = ?`

	let inserts = []
	inserts.push(
		item.title,
		item.alt,
		item.url,
		item.description,
		item.gallery,
		item.image_id
	)

	const images = await doDBQuery(sql, inserts)

	return images
}

async function getOne(id) {
	const sql = `SELECT
									image_id,
									image_id as id,
									title,
									alt,
									url,
									description,
									gallery,
									status,
									deleted,
									created_dt,
									deleted_dt,
									modified_dt,
									modified_dt as dt
							FROM
									inbrc_images
							WHERE
									deleted = 0
									AND
									image_id = ${id}`

	const image = await doDBQuery(sql)

	return image[0]
}

async function getGallery() {
	const sql = `SELECT
					title,
					alt,
					url,
					description,
					created_dt
			FROM
					inbrc_images
			WHERE
					deleted = 0
					AND
					status = 1
					AND
					gallery = 1`

	const gallery = await doDBQuery(sql)
	return gallery
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_images SET deleted = 1, deleted_dt= NOW() WHERE image_id = ` +
		id

	const images = await doDBQuery(sql)
	return images
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_images SET status = "` + status + `" WHERE image_id = ` + id
	const images = await doDBQuery(sql)
	return images
}
