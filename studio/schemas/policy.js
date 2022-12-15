export default {
	name: "policy",
	title: "Policy",
	type: "document",
	fields: [
		{
			title: "Title",
			name: "title",
			type: "string",
		},
		{
			title: "Slug",
			name: "slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
		},
		{
			title: "Body",
			name: "body",
			type: "localeBlockContent",
		},
	],
}
