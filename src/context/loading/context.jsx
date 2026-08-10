import { createContext, useContext } from "react";

const LoadingContext = createContext(null);

const useLoading = () => useContext(LoadingContext);

export { useLoading, LoadingContext };
