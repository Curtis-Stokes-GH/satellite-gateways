import { ReactNode, createContext, useState } from "react";

type User = { username: string | null; readonly: boolean };

type TUserContext = {
  user: User;
  setUser: (value: User) => void;
};

export const UserContext = createContext<TUserContext>({
  user: { username: null, readonly: true },
  setUser: () => {
    throw Error("Context is being used outside of exptected  Provider. See UserContextProvider");
  },
});

export function UserContextProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ username: "", readonly: true });
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
}
