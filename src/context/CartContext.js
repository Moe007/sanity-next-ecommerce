import React, { createContext, useContext, useState, useEffect } from "react"
import useUpdateEffect from "../hooks/useUpdateEffect"

const Context = createContext()

export const CartContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false)
	const [cartItems, setCartItems] = useState([])
	const [totalPrice, setTotalPrice] = useState(0)
	const [totalQuantities, setTotalQuantities] = useState(0)

	let foundProduct

	useEffect(() => {
		const storage = JSON.parse(localStorage.getItem("cartData"))
		setCartItems(storage?.items || [])
		setTotalPrice(storage?.totals || 0)
		setTotalQuantities(storage?.totalQuantities || 0)
	}, [])

	useUpdateEffect(() => {
		localStorage.setItem(
			"cartData",
			JSON.stringify({
				items: cartItems,
				totals: totalPrice,
				totalQuantities,
			})
		)
	}, [cartItems, totalPrice, totalQuantities])

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find((item) => {
			return item._id === product._id && item.variantKey === product.variantKey
		})

		setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (
					cartProduct._id === product._id &&
					cartProduct.variantKey === product.variantKey
				) {
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					}
				} else {
					return cartProduct
				}
			})
			setCartItems(updatedCartItems)
		} else {
			product.quantity = quantity

			setCartItems([...cartItems, { ...product }])
		}
	}

	const onRemove = (product) => {
		foundProduct = cartItems.find(
			(item) => item._id === product._id && item.variantKey === product.variantKey
		)
		const newCartItems = cartItems.filter(
			(item) =>
				!(item._id === product._id && item.variantKey === product.variantKey)
		)

		setTotalPrice(
			(prevTotalPrice) =>
				prevTotalPrice - foundProduct.price * foundProduct.quantity
		)
		setTotalQuantities(
			(prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
		)
		setCartItems(newCartItems)
	}

	const onClear = () => {
		setCartItems([])
		setTotalPrice(0)
		setTotalQuantities(0)
	}

	return (
		<Context.Provider
			value={{
				showCart,
				setShowCart,
				cartItems,
				totalPrice,
				totalQuantities,
				onAdd,
				onClear,
				onRemove,
				setCartItems,
				setTotalPrice,
				setTotalQuantities,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export const useCartContext = () => useContext(Context)
