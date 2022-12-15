import React, { useContext, useState } from "react"

const LayoutContext = React.createContext()

export const useLayout = () => useContext(LayoutContext)

export const LayoutProvider = ({ children }) => {
	const [layoutData, setLayoutData] = useState(null)

	const setLayoutState = (data) => {
		if (data) {
			setLayoutData(data)
		}
	}

	return (
		<LayoutContext.Provider value={{ layoutData, setLayoutState }}>
			{children}
		</LayoutContext.Provider>
	)
}
