import { useEffect } from "react"
import { useLayout } from "../../src/context/LayoutContext"
import { getPolicies } from "../../src/utils/policy"

const Policy = ({ policies, policy }) => {
	const { setLayoutState } = useLayout()

	useEffect(() => {
		setLayoutState(policies)
	}, [policies, setLayoutState])
	return (
		<>
			<h1>{policy.title}</h1>
			{policy.body.en.map((block) => {
				switch (block.style) {
					case "normal":
						return <p key={block._key}>{block.children[0].text}</p>
					case "h1":
						return <h2 key={block._key}>{block.children[0].text}</h2>
					case "h2":
						return <h3 key={block._key}>{block.children[0].text}</h3>
					case "h3":
						return <h4 key={block._key}>{block.children[0].text}</h4>
					case "h4":
						return <h5 key={block._key}>{block.children[0].text}</h5>
					default:
						return <div key={block._key}>{block.children[0].text}</div>
				}
			})}
		</>
	)
}

export const getStaticPaths = async () => {
	const policies = await getPolicies()

	const paths = policies.map((policy) => {
		return {
			params: { slug: policy.slug.current },
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async (ctx) => {
	const { slug } = ctx.params

	const allPolicies = await getPolicies()
	const policies = await getPolicies(`*[_type == "policy"&&slug.current=="${slug}"]`)

	return {
		props: {
			policies: allPolicies,
			policy: policies[0],
		},
		revalidate: 1,
	}
}

export default Policy
