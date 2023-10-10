import { useContext } from "react";
import { UserContext } from "../contexts/user-context";

// test intentional omited due to lack of value
export const useUserContext = () => useContext(UserContext);
