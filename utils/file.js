
export const download = (title, file) => {
	const href = URL.createObjectURL(file)
	const link = document.createElement('a')

	link.href = href
	link.setAttribute('download', title)

	document.body.appendChild(link)
	link.click()

	document.body.removeChild(link)
	URL.revokeObjectURL(href)
}
