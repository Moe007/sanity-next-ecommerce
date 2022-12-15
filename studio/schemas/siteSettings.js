export default {
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	fields: [
		{
			title: "Site Name",
			name: "siteName",
			type: "string",
		},
		{
			title: "Description",
			name: "description",
			type: "text",
		},
		{
			title: "Contact",
			name: "contact",
			type: "object",
			fields: [
				{
					title: "Email",
					name: "email",
					type: "string",
					validation: (Rule) => Rule.email(),
				},
				{ title: "Tel", name: "tel", type: "string" },
			],
		},
		{
			title: "Shipping Settings",
			name: "shippingSettings",
			type: "object",
			fields: [
				{ title: "Flat Rate", name: "flatRate", type: "number" },
				{
					title: "Free Shipping",
					name: "freeShipping",
					type: "object",
					fields: [
						{ title: "Enabled", name: "enabled", type: "boolean" },
						{ title: "Threshold", name: "threshold", type: "number" },
					],
				},
			],
		},
	],
}
