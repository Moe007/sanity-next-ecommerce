import Image from "next/image"
import Link from "next/link"
import { getPriceRange } from "../../utils/product"

const Product = ({ product }) => {
	return (
		<Link href={`/products/${product.slug.current}`}>
			<div className='flex flex-col justify-center'>
				<Image
					src={product?.defaultProductVariant?.images[0]?.src}
					alt={`Image of ${product.title}`}
					width={300}
					height={400}
				/>
				<h3 className='text-xl'>{product.title}</h3>
				<p>{getPriceRange(product).toString}</p>
			</div>
		</Link>
	)
}

export default Product
