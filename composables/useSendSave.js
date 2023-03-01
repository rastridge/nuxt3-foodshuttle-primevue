import Swal from 'sweetalert2'
export default function useSendSave() {
	//
	// Newsletters form action
	//
	function onSendSave(state, fn) {
		// const onSendSave = async function (state, fn) {
		Swal.fire({
			title: 'What to do?',
			showDenyButton: true,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: `Send now`,
			denyButtonText: `Send later`,
		}).then((result) => {
			if (result.isConfirmed) {
				fn(state, 'sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				fn(state, 'sendLater')
				Swal.fire('Saved', '', 'success')
			} else if (result.isDismissed) {
				// this.submitStatus = ''
			}
		})
	}
	return {
		onSendSave,
	}
}
