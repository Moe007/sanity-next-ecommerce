import { client } from "../lib/client"

export const getPolicies = async (query = '*[_type == "policy"]') => {
	const policies = await client.fetch(query)
	return policies
}
