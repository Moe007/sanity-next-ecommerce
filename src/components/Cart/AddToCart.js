import { useState } from "react"
import { useCartContext } from "../../context/CartContext"

const AddToCart = ({ product }) => {
	const { onAdd } = useCartContext()
	const [qty, setQty] = useState(1)

	return (
		<>
			<button
				onClick={() => onAdd(product, qty)}
				className='uppercase border border-slate-600 rounded p-2 bg-slate-300'
			>
				<span>Add To Cart</span>
			</button>
			<input
				className='text-center bg-slate-100 border border-sky-400'
				type='number'
				name='quantity'
				min='1'
				onChange={(e) => {
					e.stopPropagation()
					setQty(parseInt(e.target.value))
				}}
				value={qty}
			/>
		</>
	)
}

export default AddToCart
