import { client } from "../lib/client"

export const generateOrderNumber = async () => {
	const query = '*[_type == "order"] | order(_createdAt desc){orderNum}'
	const result = await client.fetch(query)

	if (result.length > 0) {
		return result[0].orderNum + 1
	} else {
		return 1
	}
}

export const getOrder = async (id) => {
	const order = await client.getDocument(id)
	return order
}
