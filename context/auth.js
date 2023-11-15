import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    if (typeof window !== "undefined" && !!localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (user) => {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        },
        logout: () => {
          localStorage.clear();
          setUser(undefined);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authMethods = useContext(AuthContext);
  if (!authMethods) {
    throw new TypeError("Please use within AuthProvider");
  }

  return authMethods;
}
