import Link from "next/link"
import { useEffect, useState } from "react"
import { useLayout } from "../../context/LayoutContext"

const Footer = () => {
	const { layoutData } = useLayout()

	const [policies, setPolicies] = useState([])

	useEffect(() => {
		if (layoutData) {
			setPolicies(layoutData)
		}
	}, [layoutData])

	return (
		<>
			<div>Footer</div>
			<ul>
				{policies.map((policy) => (
					<li key={policy._key}>
						<Link href={`/policy/${policy.slug.current}`}>
							{policy.title}
						</Link>
					</li>
				))}
			</ul>
		</>
	)
}

export default Footer
