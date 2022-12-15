export default {
	name: "order",
	title: "Order",
	type: "document",
	fields: [
		{
			title: "Title",
			name: "title",
			type: "string",
		},
		{
			title: "Order Number",
			name: "orderNum",
			type: "number",
		},
		{
			title: "Status",
			name: "status",
			type: "string",
			options: {
				list: [
					{ title: "Awaiting payment", value: "awaiting payment" },
					{ title: "Processing", value: "processing" },
					{ title: "Completed", value: "completed" },
					{ title: "Canceled", value: "canceled" },
					{ title: "Refunded", value: "refunded" },
				],
			},
		},
		{
			title: "Billing",
			name: "billing",
			type: "object",
			fields: [
				{ title: "First Name", name: "firstName", type: "string" },
				{ title: "Last Name", name: "lastName", type: "string" },
				{ title: "Address1", name: "address1", type: "string" },
				{ title: "Address2", name: "address2", type: "string" },
				{ title: "City", name: "city", type: "string" },
				{ title: "Province", name: "province", type: "string" },
				{ title: "Post Code", name: "postCode", type: "string" },
				{ title: "Country", name: "country", type: "string" },
				{ title: "Email", name: "email", type: "string" },
				{ title: "Phone", name: "phone", type: "string" },
			],
		},
		{
			title: "Shipping",
			name: "shipping",
			type: "object",
			fields: [
				{ title: "First Name", name: "firstName", type: "string" },
				{ title: "Last Name", name: "lastName", type: "string" },
				{ title: "Address1", name: "address1", type: "string" },
				{ title: "Address2", name: "address2", type: "string" },
				{ title: "City", name: "city", type: "string" },
				{ title: "Province", name: "province", type: "string" },
				{ title: "Post Code", name: "postCode", type: "string" },
				{ title: "Country", name: "country", type: "string" },
			],
		},

		{
			title: "Items",
			name: "items",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{ type: "string", title: "Title", name: "title" },
						{ type: "number", title: "Quantity", name: "quantity" },
						{ type: "number", title: "Price", name: "price" },
					],
				},
			],
		},
		{
			title: "Shipping Method",
			name: "shippingMethod",
			type: "string",
			options: {
				list: [
					{ title: "Delivery", value: "delivery" },
					{ title: "Collection", value: "collection" },
				],
			},
		},
		{
			title: "Totals",
			name: "totals",
			type: "object",
			fields: [
				{ title: "Subtotal", name: "subtotal", type: "number" },
				{ title: "Shipping Total", name: "shippingTotal", type: "number" },
				{ title: "Total", name: "total", type: "number" },
			],
		},
	],
}
