// 매번 렌더링 되기 전에 호출이 되는 파일
import { useEffect, useState } from 'react';
import { app } from 'firebaseApp';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; //함수를 통해 사용자가 로그인이 되었는지의 유무를 알 수 있음
import Router from './components/Router';
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'components/Loader';
// import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = getAuth(app);

  const [init, setInit] = useState<boolean>(false);
  // auth를 체크하기 전(initialize 전)에는 loader를 띄워주는 용도

  // auth의 currentUser가 있으면 isAuthenticated를 ture로 변경
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); //user가 있으면 setIsAuthenticated를 true
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <>
    <ToastContainer />
    {/* init이 된 경우에만 Home 페이지를 보여줄 수 있게 하고,
        아닌 경우에는 Loader 컴포넌트를 보여주도록 함 */}
    {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </>
  ); //Router에 isAuthenticated의 props 전달
}

export default App;
