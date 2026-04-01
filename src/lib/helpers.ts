export const helpers = {
	formatDate: (value: number | string | Date) => {
		let date: Date

		if (value instanceof Date) {
			date = value
		} else if (typeof value === 'number') {
			date = new Date(value < 1_000_000_000_000 ? value * 1000 : value)
		} else {
			const numeric = Number(value)
			if (!Number.isNaN(numeric)) {
				date = new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric)
			} else {
				date = new Date(value)
			}
		}

		return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString()
	},
}
