import { createContext, ReactNode, useState } from "react";

const ThemeContext = createContext({
  theme: "light", //초기값
  toggleMode: () => {},
});

interface ThemeProps { //타입 정의
  children: ReactNode;
}

export const ThemeContextProvider = ({children}: ThemeProps) => {
  //window의 local Storage의 값이 없으면 "light"를 주고, 아니면 원래 내가 설정했던 테마값 가져오기
  const [theme, setTheme] = useState(window.localStorage.getItem('theme') || "light");

  const toggleMode = () => {
    //이전 값을 받아서 이전값이 light이면 dark로, dark였으면 light로
    setTheme((prev) => (prev === "light" ? "dark" : "light")); 
    //window의 localStorage도 바꿔주기
    window.localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{theme, toggleMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
