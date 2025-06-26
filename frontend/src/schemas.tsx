export type PastePublic = {
	url: string
	title: string
	content: string
	created_at: string
	language: string
	is_protected: boolean
}

export type PasteOverview = {
	url: string
	title: string
	created_at: string
	is_protected : boolean
}

export type PasteCreateRequest = {
	title: string
	content: string
	key: string | null
}
