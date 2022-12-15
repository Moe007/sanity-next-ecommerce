import { useState } from "react"

const Notification = ({ type = "info", message = "" }) => {
	const [show, setShow] = useState(true)

	return (
		<div
			className={`mx-auto bg-teal-600 text-center ${
				type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : ""
			} ${show ? "" : "hidden"}`}
		>
			<span>{message}</span>
		</div>
	)
}

export default Notification
