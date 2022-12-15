import { getProducts } from "../../src/utils/product"
import AddToCart from "../../src/components/Cart/AddToCart"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLayout } from "../../src/context/LayoutContext"
import { getPolicies } from "../../src/utils/policy"

const Product = ({ policies, product }) => {
	const { setLayoutState } = useLayout()

	useEffect(() => {
		setLayoutState(policies)
	}, [policies, setLayoutState])

	const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])

	return (
		<div className='flex flex-col items-center'>
			<div className='flex flex-col justify-center'>
				<Image
					src={selectedVariant?.images[0]?.src}
					alt={`Image of ${product?.title}`}
					width={300}
					height={400}
				/>
				<h3 className='text-xl'>
					{product?.title} - {selectedVariant?.title}
				</h3>
				<p>R{selectedVariant?.price.toFixed(2)}</p>
			</div>
			<ul>
				{product?.variants.length > 0
					? [product?.defaultProductVariant, ...product?.variants]?.map(
							(variant) => (
								<li
									className={`${
										selectedVariant.title === variant.title
											? "border border-teal-400"
											: ""
									} cursor-pointer`}
									key={variant._key || "default"}
									onClick={() => setSelectedVariant(variant)}
								>
									{variant.title}
								</li>
							)
					  )
					: ""}
			</ul>
			<AddToCart
				product={{
					_id: product?._id,
					title: `${product?.title} - ${selectedVariant?.title}`,
					variantKey: selectedVariant?._key || "default",
					price: selectedVariant?.price,
				}}
			/>
		</div>
	)
}

export const getStaticPaths = async () => {
	const products = await getProducts()

	const paths = products.map((product) => {
		return {
			params: { slug: product.slug.current },
		}
	})

	return {
		paths,
		fallback: true,
	}
}

export const getStaticProps = async (ctx) => {
	const { slug } = ctx.params

	const products = await getProducts(`*[_type=="product" && slug.current =="${slug}"]`)
	const policies = await getPolicies()

	return {
		props: {
			policies,
			product: products[0],
		},
		revalidate: 1,
	}
}

export default Product
