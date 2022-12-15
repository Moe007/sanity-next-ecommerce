import axios from "axios"
import { client } from "../../../../src/lib/client"
import { getOrder } from "../../../../src/utils/order"
import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport(
// 	`smtps://${process.env.ADMIN_EMAIL}:${process.env.ADMIN_EMAIL_PASSWORD}@${process.env.ADMIN_EMAIL_HOST_NAME}`,
// 	{
// 		tls: {
// 			// do not fail on invalid certs
// 			rejectUnauthorized: false,
// 			ciphers: "SSLv3",
// 		},
// 	}
// )

const transporter = nodemailer.createTransport({
	host: process.env.ADMIN_EMAIL_HOST_NAME,
	port: 587,
	auth: {
		user: process.env.ADMIN_EMAIL,
		pass: process.env.ADMIN_EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
})

export default async function handler(req, res) {
	if (req.method === "PUT") {
		try {
			const order = await getOrder(req.query.id)

			const response = await axios.post(
				"https://online.yoco.com/v1/charges/",
				{
					token: req.body.token,
					amountInCents: order.totals.total.toFixed(2) * 100,
					currency: "ZAR",
				},
				{
					headers: {
						"X-Auth-Secret-Key": process.env.YOCO_KEY,
					},
				}
			)

			console.log("response", response)

			if (response.data.status === "successful" && response.status === 201) {
				await new Promise((resolve, reject) => {
					// verify connection configuration
					transporter.verify(function (error, success) {
						if (error) {
							console.log(error)
							reject(error)
						} else {
							console.log("Server is ready to take our messages")
							resolve(success)
						}
					})
				})
				await new Promise((resolve, reject) => {
					transporter.sendMail(
						{
							from: `Next-Sanity-Ecommerce <${process.env.ADMIN_EMAIL}>`,
							to: `${order.billing.email}, ${process.env.ADMIN_EMAIL}`,
							subject: `Order Received: ${order.title}`,
							text: `Hi ${
								order.billing.firstName
							}, we have successfully received your order. [Order #${
								order.orderNum
							}] Product Quantity Price ${order.items
								.map(
									(item) =>
										`${item.title} ${
											item.quantity
										} ${item.price.toFixed(2)}`
								)
								.join(" ")} Subtotal: ${order.totals.subtotal.toFixed(
								2
							)} Shipping: ${order.totals.shippingTotal.toFixed(
								2
							)} Total: ${order.totals.total.toFixed(
								2
							)} Thanks for shopping with us.`,
							html: `<p>Hi ${
								order.billing.firstName
							},</p><p>We have successfully received your order. [Order #${
								order.orderNum
							}]</p><table><thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead><tbody>${order.items
								.map(
									(item) =>
										`<tr><td>${item.title}</td><td>${
											item.quantity
										}</td><td>${item.price.toFixed(2)}</td></tr>`
								)
								.join(
									" "
								)}<tr><td colspan="2">Subtotal</td>:<td>R${order.totals.subtotal.toFixed(
								2
							)}</td></tr><tr><td colspan="2">Shipping</td>:<td>R${order.totals.shippingTotal.toFixed(
								2
							)}</td></tr><tr><td colspan="2">Total</td>:<td>R${order.totals.total.toFixed(
								2
							)}</td></tr></tbody></table><p>Thanks for shopping with us.</p>`,
						},
						(err, info) => {
							if (err) {
								console.error(err)
								reject(err)
							} else {
								console.log(info)
								resolve(info)
							}
						}
					)
				})
				const updatedOrder = await client
					.patch(req.query.id)
					.set({ status: "processing" })
					.commit()
				res.status(201).json({ message: "Payment was successful!" })
			} else {
				res.status(response.status).json({ message: "Payment was unsuccessful!" })
			}
		} catch (error) {
			res.json(error)
		}
	} else {
		res.status(404).end()
	}
}
