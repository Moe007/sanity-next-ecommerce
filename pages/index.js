import { useEffect } from "react"
import Product from "../src/components/Product"
import { useLayout } from "../src/context/LayoutContext"
import { getPolicies } from "../src/utils/policy"
import { getProducts } from "../src/utils/product"

export default function Home({ products, policies }) {
	const { setLayoutState } = useLayout()

	useEffect(() => {
		setLayoutState(policies)
	}, [policies, setLayoutState])

	return (
		<main className='mx-12'>
			<h1 className='text-3xl'>Products</h1>
			<ul className='mt-8 flex gap-8 flex-wrap'>
				{products.map((product) => (
					<li key={product._id}>
						<Product product={product} />
					</li>
				))}
			</ul>
		</main>
	)
}

export const getStaticProps = async () => {
	const products = await getProducts()
	const policies = await getPolicies()

	return {
		props: {
			products,
			policies,
		},
		revalidate: 1,
	}
}
