import { client } from "../../../src/lib/client"
import { generateOrderNumber } from "../../../src/utils/order"
import { getProducts } from "../../../src/utils/product"
import { getShippingCost } from "../../../src/utils/siteSetting"

export default async function handler(req, res) {
	if (req.method === "POST") {
		const items = await Promise.all(
			req.body.cartItems.map(async (item) => {
				const products = await getProducts(
					`*[_type=="product" && _id=="${item._id}"]`
				)

				const price =
					item.variantKey === "default"
						? products[0]?.defaultProductVariant.price
						: products[0]?.variants.find(
								(variant) => variant._key === item.variantKey
						  ).price

				return {
					title: item.title,
					quantity: item.quantity,
					price,
				}
			})
		)

		const shippingCost =
			req.body.shippingMethod === "delivery" ? await getShippingCost() : 0

		const totals = {
			subtotal: items.reduce((total, item) => {
				return total + item.price * item.quantity
			}, 0),
			shippingTotal: shippingCost,
		}

		const orderNum = await generateOrderNumber()

		const doc = {
			_type: "order",
			title: `${req.body.bFName} ${req.body.bLName} #${orderNum}`,
			orderNum,
			status: "awaiting payment",
			billing: {
				firstName: req.body.bFName,
				lastName: req.body.bLName,
				address1: req.body.bAddress1,
				address2: req.body.bAddress2,
				city: req.body.bCity,
				province: req.body.bProvince,
				postCode: req.body.bPostCode,
				country: "ZA",
				email: req.body.email,
				phone: req.body.cell,
			},
			shipping: {
				firstName: req.body.sFName || req.body.bFName,
				lastName: req.body.sLName || req.body.bLName,
				address1: req.body.sAddress1 || req.body.bAddress1,
				address2: req.body.sAddress2 || req.body.bAddress2,
				city: req.body.sCity || req.body.bCity,
				province: req.body.sProvince || req.body.bProvince,
				postCode: req.body.sPostCode || req.body.bPostCode,
				country: "ZA",
			},
			items,
			shippingMethod: req.body.shippingMethod,
			totals: { ...totals, total: totals.subtotal + totals.shippingTotal },
		}

		try {
			const response = await client.create(doc, { autoGenerateArrayKeys: true })

			res.status(201).json(response)
		} catch (error) {
			res.json(error)
		}
	} else {
		res.status(404).end()
	}
}
