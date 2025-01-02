import { createContext, ReactNode, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "firebaseApp";
//useState: 현재 user를 리턴해야 하기 때문에 그 user 값을 저장하기 위해 import

interface AuthProps {
  children: ReactNode
}

const AuthContext = createContext({
  user: null as User | null, //user의 초기값은 null, 타입은 firebase/auth의 User로
});

//context Provider: context를 구독하는 컴포넌트들의 context의 변화를 알려주게 하는 기능
export const AuthContextProvider = ({ children }: AuthProps) => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user); //user가 있으면 setCurrentUser를 true
        } else {
          setCurrentUser(user);
        }
      });
    }, [auth]);

    //currentUser 값을 하위에 있는 children에게 넘겨주기
    return (
      <AuthContext.Provider value={{ user: currentUser}}>
        {children}
      </AuthContext.Provider>
    )
};

//다른페이지에서도 사용할 수 있도록 export
export default AuthContext;