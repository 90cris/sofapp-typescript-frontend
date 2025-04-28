import { useState } from "react";
import { User } from "../context/IUserContext"; 

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    return { user, login, logout };
}

export default useUser;