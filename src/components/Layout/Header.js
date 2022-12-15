import Link from "next/link"
import { useCartContext } from "../../context/CartContext"
import LineItem from "../Product/LineItem"

const Header = () => {
	const { showCart, setShowCart, totalQuantities, cartItems, totalPrice } =
		useCartContext()

	const toggleCart = () => setShowCart(!showCart)

	return (
		<header>
			<nav className='flex justify-between px-12 py-4'>
				<ul>
					<li>
						<Link href={"/"}>Home</Link>
					</li>
				</ul>
				<ul>
					<li className='cursor-pointer' onClick={toggleCart}>
						Cart <span>{totalQuantities}</span>
						{showCart ? (
							<div className='fixed inset-0 z-40 w-full h-full bg-slate-600 opacity-20' />
						) : (
							""
						)}
						<div
							onClick={(e) => e.stopPropagation()}
							aria-modal='true'
							aria-labelledby='cartmenu-label'
							className={`relative bg-slate-400 z-50 px-12 py-6 text-center space-y-4 ${
								showCart ? "block -translate-x-6" : "hidden"
							}`}
						>
							<h3 id='cartmenu-label'>Cart</h3>

							<ul>
								{cartItems.map((item) => (
									<li
										key={`item:${item._id}, variant:${item.variantKey}`}
									>
										<LineItem product={item} />
									</li>
								))}
							</ul>

							<div className='border border-sky-700'>
								<h5>Totals</h5>
								<p>Subtotal: R{totalPrice.toFixed(2)}</p>
								<p>Shipping: R0.00</p>
								<p>Total: R{totalPrice.toFixed(2)}</p>
							</div>
							<Link href='/checkout'>
								<button
									onClick={toggleCart}
									className='p-2 border border-slate-800 bg-slate-300'
								>
									Checkout
								</button>
							</Link>
						</div>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
