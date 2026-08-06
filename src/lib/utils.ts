import { profile } from '../settings'
import { template } from '../settings'

export function highlightAuthor(authors: string): string {
	const name = profile.fullName?.trim()
	if (!name || !authors.includes(name)) {
		return authors
	}
	return authors.replace(
		name,
		`<span class='font-medium underline'>${name}</span>`
	)
}

export function trimExcerpt(excerpt: string): string {
	const excerptLength = template.excerptLength
	return excerpt.length > excerptLength ? `${excerpt.substring(0, excerptLength)}...` : excerpt
}
