// 매번 렌더링 되기 전에 호출이 되는 파일
//import React from 'react';
//import './App.css';
import { useState } from 'react';
import { app } from 'firebaseApp';
import { getAuth } from 'firebase/auth'; //함수를 통해 사용자가 로그인이 되었는지의 유무를 알 수 있음
import Router from './components/Router';

function App() {
  const auth = getAuth(app);
  //const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  ); //auth의 currentUser가 있으면 true, 없으면 false 반환함
  return <Router isAuthenticated={isAuthenticated} />; //Router에 isAuthenticated의 props 전달
}

export default App;
