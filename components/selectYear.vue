<template>
	<div>
		<Dropdown
			v-model="year"
			:options="years"
			optionLabel="label"
			optionValue="value"
			placeholder="Select a Different Year"
		/>
		<!-- year = {{ year }} years = {{ years }} -->
	</div>
</template>

<script setup>
	import Dropdown from 'primevue/dropdown'
	const { $dayjs } = useNuxtApp()
	//
	// Incoming
	//
	const props = defineProps({
		startyear: {
			type: Number,
			required: true,
		},
	})
	//
	// Outgoing
	//
	const emit = defineEmits(['submitted'])

	//
	// Info for dropdown
	//
	const year = ref($dayjs().format('YYYY'))
	const years = computed(() => {
		{
			const years = [] // array of numbers
			const thisyear = parseInt($dayjs().format('YYYY'))
			for (let year = props.startyear; year <= thisyear + 1; year++) {
				years.push({ label: year, value: year })
			}
			return years
		}
	})
	//
	// Action for dropdown
	//

	// this.$store.commit('pagination/saveyear', value)
	// this.$store.commit('pagination/savepage', '1')

	watch(year, () => emit('submitted', year.value))
</script>

<style lang="scss" scoped>
	.p-dropdown {
		width: 20rem;
	}
	@media screen and (max-width: 640px) {
		.p-treeselect {
			width: 100%;
		}
	}
</style>
