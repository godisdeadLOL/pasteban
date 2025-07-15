export type PastePublic = {
	url: string
	title: string
	content: string
	language: string

	created_at: string
	is_protected: boolean

	deletable: boolean
	updatable: boolean

	expiration: number | null
}

export type PasteOverview = {
	url: string
	title: string
	created_at: string
	is_protected : boolean

	deletable: boolean
	updatable: boolean
}

export type PasteCreateRequest = {
	title: string
	content: string
	language: string

	key: string | null

	updatable: boolean
	deletable: boolean

	duration: string
}

export type PasteUpdateRequest = {
	title: string
	content: string
	language: string
}