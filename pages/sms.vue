<template>
	<div>
		<button @click="handleClick">Say Hello via SMS!</button>
		<p>status = {{ status }}</p>
	</div>
</template>
<style>
	button {
		color: #000;
		padding: 15px 10px;
		border: 1px solid black;
		border-radius: 3px;
	}

	button:hover {
		color: #fff;
		background: navy;
	}
</style>
<script setup>
	const status = ref('')
	const handleClick = async () => {
		const response = await fetch('https://foodshuttlesms-2944.twil.io/sms')
		const data = await response.json()
		this.status = data.status
	}
</script>
