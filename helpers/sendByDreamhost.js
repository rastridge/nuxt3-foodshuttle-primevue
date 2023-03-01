const nodemailer = require('nodemailer')
const {
	DH_SMTP_HOST,
	DH_SMTP_PORT,
	DH_SMTP_SECURE,
	DH_SMTP_USER,
	DH_SMTP_PASS,
} = useRuntimeConfig()
export async function sendByDreamhost(email) {
	// async function sendByDreamhost(msg, from, email) {

	let transporter = nodemailer.createTransport({
		host: DH_SMTP_HOST,
		port: DH_SMTP_PORT,
		secure: DH_SMTP_SECURE,
		auth: {
			user: DH_SMTP_USER,
			pass: DH_SMTP_PASS,
		},
	})

	let info = await transporter.sendMail({
		from: email.from, // sender address
		to: email.to, // list of receivers
		subject: email.subject, // Subject line
		text: email.body_text, // plain text body
		html: email.body_html, // html body
	})
}
