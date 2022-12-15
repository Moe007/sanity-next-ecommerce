import axios from "axios"
import Script from "next/script"
import { useEffect, useState } from "react"
import Input from "../../src/components/Input"
import Notification from "../../src/components/Notification"
import { useCartContext } from "../../src/context/CartContext"
import { useLayout } from "../../src/context/LayoutContext"
import { getPolicies } from "../../src/utils/policy"

const Checkout = ({ policies }) => {
	const { setLayoutState } = useLayout()

	useEffect(() => {
		setLayoutState(policies)
	}, [policies, setLayoutState])

	const { cartItems, onClear } = useCartContext()

	const [sameShippingInfo, setSameShippingInfo] = useState(false)

	const [transaction, setTransaction] = useState({
		completed: false,
		error: false,
		message: "",
	})

	const [formData, setFormData] = useState({
		bFName: "",
		bLName: "",
		email: "",
		cell: "",
		bAddress1: "",
		bAddress2: "",
		bCity: "",
		bProvince: "",
		bPostCode: "",
		shippingMethod: "delivery",
		sFName: "",
		sLName: "",
		sAddress1: "",
		sAddress2: "",
		sCity: "",
		sProvince: "",
		sPostCode: "",
	})

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (sameShippingInfo) {
			setFormData({
				...formData,
				sFName: "",
				sLName: "",
				sAddress1: "",
				sAddress2: "",
				sCity: "",
				sProvince: "",
				sPostCode: "",
			})
		}

		const res = await axios.post("/api/order", { ...formData, cartItems })

		if (res.data._id) {
			const yoco = new window.YocoSDK({
				publicKey: process.env.NEXT_PUBLIC_YOCO_KEY,
			})

			yoco.showPopup({
				amountInCents: res.data.totals.total.toFixed(2) * 100,
				currency: "ZAR",
				name: "Next-Sanity-Ecommerce",
				description: `Order #${res.data.orderNum}`,
				callback: async function (result) {
					// This function returns a token that your server can use to capture a payment
					if (result.error) {
						const errorMessage = result.error.message
						alert("error occured: " + errorMessage)
					} else {
						const response = await axios.put(`api/order/${res.data._id}`, {
							token: result.id,
						})
						setFormData({
							bFName: "",
							bLName: "",
							email: "",
							cell: "",
							bAddress1: "",
							bAddress2: "",
							bCity: "",
							bProvince: "",
							bPostCode: "",
							shippingMethod: "delivery",
							sFName: "",
							sLName: "",
							sAddress1: "",
							sAddress2: "",
							sCity: "",
							sProvince: "",
							sPostCode: "",
						})
						alert(response.data.message)
						onClear()
					}
					// In a real integration - you would now pass this chargeToken back to your
					// server along with the order/basket that the customer has purchased.
				},
				customer: {
					email: formData.email,
					phone: formData.cell,
					firstName: formData.bFName,
					lastName: formData.bLName,
				},
			})
		}
	}

	return (
		<>
			{transaction.completed === false ? (
				<div className='text-center bg-slate-300 mx-12 px-12'>
					<h2>Checkout</h2>
					{transaction.error === true ? (
						<Notification
							type='error'
							message={
								transaction.message ||
								"Payment was unsuccessful, please try again or contact support."
							}
						/>
					) : (
						""
					)}
					<form onSubmit={handleSubmit}>
						<div className='billing-info'>
							<h5>Billing Details</h5>
							<Input
								id='firstName'
								label='First Name(s)*'
								placeholder='John'
								required={true}
								value={formData.bFName}
								onChange={(e) =>
									setFormData({ ...formData, bFName: e.target.value })
								}
							/>
							<Input
								id='lastName'
								label='Last Name*'
								placeholder='Doe'
								required={true}
								value={formData.bLName}
								onChange={(e) =>
									setFormData({ ...formData, bLName: e.target.value })
								}
							/>
							<Input
								id='email'
								type='email'
								label='Email*'
								placeholder='john@example.com'
								required={true}
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
							<Input
								id='cell'
								label='Cellphone Number*'
								placeholder='Cell Num'
								required={true}
								value={formData.cell}
								onChange={(e) =>
									setFormData({ ...formData, cell: e.target.value })
								}
							/>
							<Input
								id='address1'
								label='Address 1*'
								placeholder='Address'
								className='address'
								required={true}
								value={formData.bAddress1}
								onChange={(e) =>
									setFormData({
										...formData,
										bAddress1: e.target.value,
									})
								}
							/>
							<Input
								id='address2'
								label='Address 2 (Optional)'
								placeholder='Apartment num, suite num...'
								value={formData.bAddress2}
								onChange={(e) =>
									setFormData({
										...formData,
										bAddress2: e.target.value,
									})
								}
							/>
							<Input
								id='city'
								label='City*'
								placeholder='City'
								required={true}
								value={formData.bCity}
								onChange={(e) =>
									setFormData({ ...formData, bCity: e.target.value })
								}
							/>
							<Input
								id='province'
								label='Province*'
								placeholder='Province'
								required={true}
								value={formData.bProvince}
								onChange={(e) =>
									setFormData({
										...formData,
										bProvince: e.target.value,
									})
								}
							/>
							<Input
								id='pCode'
								label='Postal Code*'
								placeholder='Postal Code'
								required={true}
								value={formData.bPostCode}
								pattern='[0-9]*'
								onChange={(e) => {
									if (e.target.value.match("^[0-9]*$") != null) {
										setFormData({
											...formData,
											bPostCode: e.target.value,
										})
									}
								}}
							/>
						</div>
						<div
							className={`shipping-info ${
								sameShippingInfo ? "[&>:nth-child(n+4)]:hidden" : ""
							}`}
						>
							<h5>Shipping Details</h5>
							<fieldset>
								<legend>Select a shipping method: </legend>
								<Input
									id='delivery'
									label='Delivery'
									type='radio'
									name='shipping'
									value='delivery'
									defaultChecked={true}
									onChange={(e) => {
										setFormData({
											...formData,
											shippingMethod: e.target.value,
										})
									}}
								/>
								<Input
									id='delivery'
									label='Collection'
									type='radio'
									name='shipping'
									value='collection'
									onChange={(e) => {
										setFormData({
											...formData,
											shippingMethod: e.target.value,
										})
									}}
								/>
							</fieldset>
							<Input
								id='asBilling'
								label='Same as billing?'
								type='checkbox'
								defaultChecked={sameShippingInfo}
								onChange={(e) =>
									e.target.checked
										? setSameShippingInfo(true)
										: setSameShippingInfo(false)
								}
							/>
							<Input
								id='firstName'
								label='First Name(s)'
								placeholder='John'
								value={formData.sFName}
								onChange={(e) =>
									setFormData({ ...formData, sFName: e.target.value })
								}
							/>
							<Input
								id='lastName'
								label='Last Name'
								placeholder='Doe'
								value={formData.sLName}
								onChange={(e) =>
									setFormData({ ...formData, sLName: e.target.value })
								}
							/>
							<Input
								id='address1'
								label='Address 1'
								placeholder='Address'
								className='address'
								value={formData.sAddress1}
								onChange={(e) =>
									setFormData({
										...formData,
										sAddress1: e.target.value,
									})
								}
							/>
							<Input
								id='address2'
								label='Address 2 (Optional)'
								placeholder='Apartment num, suite num...'
								value={formData.sAddress2}
								onChange={(e) =>
									setFormData({
										...formData,
										sAddress2: e.target.value,
									})
								}
							/>
							<Input
								id='city'
								label='City'
								placeholder='City'
								value={formData.sCity}
								onChange={(e) =>
									setFormData({ ...formData, sCity: e.target.value })
								}
							/>
							<Input
								id='province'
								label='Province'
								placeholder='Province'
								value={formData.sProvince}
								onChange={(e) =>
									setFormData({
										...formData,
										sProvince: e.target.value,
									})
								}
							/>
							<Input
								id='pCode'
								label='Postal Code'
								placeholder='Postal Code'
								value={formData.sPostCode}
								pattern='[0-9]*'
								onChange={(e) => {
									if (e.target.value.match("^[0-9]*$") != null) {
										setFormData({
											...formData,
											sPostCode: e.target.value,
										})
									}
								}}
							/>
						</div>
						<button className='bg-slate-600 text-white p-4' type='submit'>
							Continue to Payment
						</button>
					</form>
				</div>
			) : (
				""
			)}
			<Script src='https://js.yoco.com/sdk/v1/yoco-sdk-web.js' />
		</>
	)
}

export const getStaticProps = async () => {
	const policies = await getPolicies()

	return {
		props: {
			policies,
		},
		revalidate: 1,
	}
}

export default Checkout
