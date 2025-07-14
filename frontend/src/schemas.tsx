export type PastePublic = {
	url: string
	title: string
	content: string
	created_at: string
	is_protected: boolean

	deletable: boolean
	updatable: boolean
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
	key: string | null

	updatable: boolean
	deletable: boolean
}

export type PasteUpdateRequest = {
	title: string
	content: string
}