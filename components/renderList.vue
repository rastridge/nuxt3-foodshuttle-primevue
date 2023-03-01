<template>
	<div>
		<div v-if="viewable">
			<div class="table-box">
				<DataTable
					ref="dataTableRef"
					:value="datalocal"
					striped-rows
					class="p-datatable-sm p-datatable-generic"
					responsiveLayout="scroll"
					:paginator="true"
					:rows="perPage"
					paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
					:rows-per-page-options="[10, 20, 50]"
					current-page-report-template="Showing {first} to {last} of {totalRecords}"
				>
					<!-- 					<template #header>
						<div class="datatable-header">
							<div class="flex justify-content-center">
								<span class="text-l"
									>{{ datalocal ? datalocal.length : 0 }} Records</span
								>
							</div>
						</div>
					</template> -->
					<template #empty> No Data Found. </template>
					<Column v-if="statusable" field="status" header="Use"
						><template #body="slotProps">
							<a
								href="#"
								@click="
									changeStatus({
										id: slotProps.data.id,
										status: slotProps.data.status,
									})
								"
								><i v-if="slotProps.data.status" class="pi pi-thumbs-up"></i
								><i v-else class="pi pi-thumbs-down"></i
							></a> </template
					></Column>
					<Column field="title" header="Name"></Column>
					<Column field="dt" header="Modified">
						<template #body="slotProps">
							{{ $dayjs(slotProps.data.dt).format('YYYY-MM-DD h:mm a') }}
						</template></Column
					>
					<Column
						v-if="editable || deleteable"
						field="id"
						header="Actions"
						:exportable="false"
						style="min-width: 8rem"
					>
						<template #body="slotProps">
							<nuxt-link
								v-if="editable"
								:to="`/admin/${app}/${slotProps.data.id}`"
								class="me-2"
								><i class="pi pi-pencil"></i>
							</nuxt-link>
							&nbsp;
							<a
								v-if="deleteable"
								href="#"
								@click="deleteItem(slotProps.data.id)"
								><i class="pi pi-trash"></i
							></a>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>

		<!-- Confirm deletion -->
		<Dialog
			v-model:visible="deleteDialog"
			:style="{ width: '450px' }"
			header="Confirm deletion"
			:modal="true"
		>
			<div class="confirmation-content">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span>Are you sure you want to delete this record? >?</span>
			</div>

			<template #footer>
				<Button
					label="No"
					icon="pi pi-times"
					class="p-button-text"
					@click="deleteDialog = false"
				/>
				<Button
					label="Yes"
					icon="pi pi-check"
					class="p-button-text"
					@click="confirmedDelete(itemId)"
				/>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
	//
	// make date functions available
	//
	const { $dayjs } = useNuxtApp()
	//
	// Incoming
	//
	const props = defineProps({
		data: { type: Array, required: true },
		pagesize: { type: Number, default: 15, required: false },
		app: { type: String, default: '', required: true },
		statusable: { type: Boolean, default: false, required: false },
		editable: { type: Boolean, default: false, required: false },
		deleteable: { type: Boolean, default: false, required: false },
		viewable: { type: Boolean, default: false, required: false },
	})
	//
	// outgoing
	//
	const emit = defineEmits(['changeStatus', 'deleteItem'])
	//
	// make local copy of input data
	//
	const datalocal = ref(props.data)
	//
	// Initial settings for pagination
	const perPage = 10
	//
	// Initial settings for dialog
	//
	const itemId = ref('')
	const deleteDialog = ref(false)

	//
	// React to change in Incoming data
	//
	watchEffect(() => {
		// alert('IN WATCH')
		datalocal.value = props.data
	})

	//
	// Change status in local data and database
	//
	const changeStatus = ({ id, status }) => {
		status = status ? 0 : 1
		// in browser
		const pos = datalocal.value.findIndex((u) => u.id === id)
		datalocal.value[pos].status = status
		// in DB
		emit('changeStatus', { id, status })
	}
	//
	// Delete in local data and database
	//
	const deleteItem = (id) => {
		// save item id
		itemId.value = id
		// open confirm dialog
		deleteDialog.value = true
	}
	const confirmedDelete = (id) => {
		// deletion confirmed
		// close confirm dialog
		deleteDialog.value = false
		// in browser
		datalocal.value = datalocal.value.filter((u) => u.id !== id)
		// in database
		emit('deleteItem', id)
	}
</script>

<style scoped>
	.table-box {
		background-color: rgb(255, 255, 255);
		padding: 0.5rem;
		padding-top: 1rem;
		border-radius: 10px;
		border: thin rgb(0, 0, 0) solid;
	}

	.p-component {
		font-family: Roboto, Helvetica, Arial;
		font-size: 0.9rem;
		font-weight: normal;
	}
</style>
