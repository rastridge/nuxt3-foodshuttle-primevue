export default defineEventHandler((event) => {
	console.log('==== New request endpoint: ' + event.node.req.url)
})
