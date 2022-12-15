import { NextSeo } from "next-seo"
import Footer from "./Footer"
import Header from "./Header"

const Layout = ({ children }) => {
	return (
		<div className='flex flex-col'>
			<NextSeo
				title='NextJS Sanity Ecommerce'
				description='An example of an ecommerce site built with NextJS and Sanity io.'
				canonical={process.env.NEXT_PUBLIC_SITE_URL}
				openGraph={{
					url: process.env.NEXT_PUBLIC_SITE_URL,
					title: "NextJS Sanity Ecommerce",
					description:
						"An example of an ecommerce site built with NextJS and Sanity io.",
					siteName: "NextJS Sanity Ecommerce",
				}}
			/>
			<Header />
			<div className='grow basis-[85vh]'>{children}</div>
			<Footer />
		</div>
	)
}

export default Layout
