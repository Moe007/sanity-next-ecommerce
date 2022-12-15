import { client, urlFor } from "../lib/client"

export const getProducts = async (query = '*[_type == "product"]') => {
	const products = await client.fetch(query)
	//Build images
	const withImageUrls = products.map((product) => {
		const defaultVariantImages = product.defaultProductVariant.images.map((img) => {
			return { ...img, src: urlFor(img).size(900, 1200).url() }
		})

		const variants = product.variants.map((variant) => {
			return {
				...variant,
				images: variant.images.map((img) => {
					return { ...img, src: urlFor(img).size(300, 400).url() }
				}),
			}
		})
		return {
			...product,
			defaultProductVariant: {
				...product.defaultProductVariant,
				images: defaultVariantImages,
			},
			variants,
		}
	})

	return withImageUrls
}

export const getPriceRange = (product) => {
	let minPrice = product.defaultProductVariant.price
	let maxPrice = product.defaultProductVariant.price

	for (const variant of product.variants) {
		if (minPrice > variant.price) {
			minPrice = variant.price
		} else if (maxPrice < variant.price) {
			maxPrice = variant.price
		}
	}

	return {
		minPrice,
		maxPrice,
		toString:
			minPrice === maxPrice
				? `R${minPrice.toFixed(2)}`
				: `R${minPrice.toFixed(2)}-R${maxPrice.toFixed(2)}`,
	}
}
