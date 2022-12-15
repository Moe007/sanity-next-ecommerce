import { client } from "../lib/client"

export const getShippingCost = async () => {
	const data = await client.fetch('*[_type == "siteSettings"]')
	const { shippingSettings } = data[0]
	return shippingSettings.flatRate
}
