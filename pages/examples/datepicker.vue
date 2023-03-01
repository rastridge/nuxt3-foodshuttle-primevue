<template>
	<div>
		<h3>Date picker</h3>
		<Calendar
			v-model="value"
			dateFormat="yy.mm.dd"
			:showTime="true"
			:showSeconds="true"
			:showIcon="true"
			autocomplete="on"
		/>
		<p>{{ value }}</p>
	</div>
</template>

<script setup>
	import Calendar from 'primevue/calendar'
	const value = ref(null)
</script>

<style lang="scss" scoped></style>
