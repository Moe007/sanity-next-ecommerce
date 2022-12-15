import Layout from "../src/components/Layout"
import { CartContext } from "../src/context/CartContext"
import { LayoutProvider } from "../src/context/LayoutContext"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
	return (
		<CartContext>
			<LayoutProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</LayoutProvider>
		</CartContext>
	)
}

export default MyApp
