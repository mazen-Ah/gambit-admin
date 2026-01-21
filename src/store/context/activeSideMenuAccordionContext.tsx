import React, { createContext, useState } from "react";

// Define types for context values
interface ActiveSideMenuAccordionContextProps {
	activeSideMenuAccordion: number|string;
	setActiveSideMenuAccordion: React.Dispatch<React.SetStateAction<number|string>>;
}
interface prop {
	children: React.ReactNode;
}
// Create context with initial values
export const ActiveSideMenuAccordionContext = createContext<ActiveSideMenuAccordionContextProps>({
	activeSideMenuAccordion: -1,
	setActiveSideMenuAccordion: () => { },
});

const ActiveSideMenuAccordionContextProvider: React.FC<prop> = (props) => {
	// State for active accordion index
	const [activeSideMenuAccordion, setActiveSideMenuAccordion] = useState<number|string>(-1);

	return (
		<ActiveSideMenuAccordionContext.Provider value={{
			activeSideMenuAccordion,
			setActiveSideMenuAccordion
		}}>
			{props.children}
		</ActiveSideMenuAccordionContext.Provider>
	);
};

export default ActiveSideMenuAccordionContextProvider;
