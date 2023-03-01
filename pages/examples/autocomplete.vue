<template>
	<div>
		<h6>Autocomplete</h6>
		<p>fruit {{ fruit }}</p>
		<p>fruits {{ fruits }}</p>
		<p>filteredFruits {{ filteredFruits }}</p>
		<AutoComplete
			v-model="fruit"
			:suggestions="filteredFruits"
			@complete="search($event)"
			field="fruit"
		>
			<template #item="{ item }">
				<div>
					<div>{{ item }}</div>
				</div>
			</template>
		</AutoComplete>
	</div>
</template>

<script setup>
	import AutoComplete from 'primevue/autocomplete'

	const fruit = ref('')
	const filteredFruits = ref(['apple', 'orange', 'grape'])
	const fruits = ['apple', 'orange', 'grape']

	const search = ({ query }) => {
		if (!query.trim()) {
			filteredFruits.value = [...fruits]
			return
		}
		filteredFruits.value = fruits.filter((f) => f.includes(query))
	}
</script>
