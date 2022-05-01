export default function () {
	return {
		env: {
			type: 'node',
			params: {
				runner: '--experimental-vm-modules --trace-warnings',
			},
		},
	};
}
