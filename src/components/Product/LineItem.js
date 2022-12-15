import { useCartContext } from "../../context/CartContext"

const LineItem = ({ product }) => {
	const { onRemove } = useCartContext()
	return (
		<div className='flex flex-col gap-3 border border-sky-700 p-2'>
			<h4>{product.title}</h4>
			<p>Quantity: {product.quantity}</p>
			<p>R{product.price.toFixed(2)}</p>
			<button onClick={() => onRemove(product)} className=' bg-red-800 text-white'>
				Delete
			</button>
		</div>
	)
}

export default LineItem
