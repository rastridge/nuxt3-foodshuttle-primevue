<template>
	<div>
		<h3>Upload Widget Component</h3>
		<ClientOnly>
			<button v-on:click="start" id="upload_widget" class="cloudinary-button">
				Upload files
			</button>
		</ClientOnly>
	</div>
</template>

<script setup>
	const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_UPLOAD_PRESET } =
		useRuntimeConfig()
	//
	// Outgoing
	//
	const emit = defineEmits(['uploaded'])

	// Remove the comments from the code below to add
	// additional functionality.
	// Note that these are only a few examples, to see
	// the full list of possible parameters that you
	// can add see:
	//   https://cloudinary.com/documentation/upload_widget_reference

	function startxxxx() {
		cloudinary.openUploadWidget(
			{
				cloudName: 'rfamedia',
				uploadPreset: 'x93ekmgy',
				sources: ['local', 'url', 'camera', 'image_search'],
				showAdvancedOptions: true,
				cropping: true,
				multiple: true,
				defaultSource: 'local',
				styles: {
					palette: {
						window: '#10173a',
						sourceBg: '#20304b',
						windowBorder: '#7171D0',
						tabIcon: '#79F7FF',
						inactiveTabIcon: '#8E9FBF',
						menuIcons: '#CCE8FF',
						link: '#72F1FF',
						action: '#5333FF',
						inProgress: '#00ffcc',
						complete: '#33ff00',
						error: '#cc3333',
						textDark: '#000000',
						textLight: '#ffffff',
					},
					fonts: {
						default: null,
						"'IBM Plex Sans', sans-serif": {
							url: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans',
							active: true,
						},
					},
				},
				maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
			},
			(err, info) => {
				if (!err) {
					console.log('Upload Widget event - info.url =  ', info.url)
					emit('uploaded', info.url)
				}
			}
		)
	}

	const start = () => {
		const myWidget = cloudinary.createUploadWidget(
			{
				cloudName: CLOUD_NAME,
				uploadPreset: CLOUD_UPLOAD_PRESET,
				cropping: true, //add a cropping step
				// showAdvancedOptions: true,  //add advanced options (public_id and tag)
				sources: ['local', 'url', 'camera'],
				// multiple: false,  //restrict upload to a single file
				// folder: "user_images", //upload files to the specified folder
				// tags: ["users", "profile"], //add the given tags to the uploaded files
				// context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
				// clientAllowedFormats: ["images"], //restrict uploading to image files only
				// maxImageFileSize: 2000000,  //restrict file size to less than 2MB
				maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
				// theme: 'purple', //change to a purple theme
			},
			(error, result) => {
				if (!error && result && result.event === 'success') {
					console.log('Done! Here is the image info: ', result.info)
					emit('uploaded', result.info.url)
				}
			}
		)
		myWidget.open()
	}
	const open = function () {
		myWidget.open()
	}
</script>
