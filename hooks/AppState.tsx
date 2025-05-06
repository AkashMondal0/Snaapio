import { AppContext, AppContextType } from "@/provider/PreConfiguration";
import { useContext } from "react";


const useAppState = (): AppContextType => {
	const appState = useContext(AppContext);
	return appState;
};

export default useAppState;
