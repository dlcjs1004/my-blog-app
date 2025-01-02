//email, password, password_confirm 이 세 값들이 잘 들어갔는지 체크하고, 서브미스할 것이기 때문
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "firebaseApp";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [error, setError] = useState<string>("");

  //세 가지 변수 생성
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfrim, setPasswordConfirm] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //바로 submit하는 게 아니라 일단 체크를 해줘야 함
    try {
      const auth = getAuth(app);
      //async await으로 비동기 요청
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("회원가입에 성공했습니다!");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };

  //form 안에서 변경이 되었을 때마다 호출하는 onChange 메서드 생성
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value}, //name은 input의 name(email인지, password인지, passwordConfirm인지)
    } = e;

    //console.log(name, value);
    if (name ==='email') {
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //이메일이 유효한지 체크하는 정규 표현식
      
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === 'password') {
      setPassword(value);

      if(value?.length < 8) { //8자리 미만이면 error 발생
        setError("비밀번호는 8자리 이상으로 입력해주세요.")
      } else if (passwordConfrim?.length > 0 && value !== passwordConfrim) { //비밀번호보다 비밀번호 확인 값을 먼저 쳤을 때
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 다시 확인해주세요.")
      } else {
        setError("");
      }
    }
    if (name === 'password_confirm') {
      setPasswordConfirm(value);

      if(value?.length < 8) { //8자리 미만이면 error 발생
        setError("비밀번호는 8자리 이상으로 입력해주세요.")
      } else if(value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 다시 확인해주세요.")
      } else {
        setError("");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="form form--lg">
      <h1 className="form__title">회원가입</h1>

      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          required 
          onChange={onChange}
        />
      </div>

      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          required
          onChange={onChange} />
      </div>

      <div className="form__block">
        <label htmlFor="password_confirm">비밀번호 확인</label>
        <input 
          type="password" 
          name="password_confirm" 
          id="password_confirm" 
          required
          onChange={onChange} />
      </div>

{/* error가 있을 시 나타내주기 */}
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}      

      <div className="form__block"> 계정이 이미 있으신가요?
        <Link to="/login" className="form__link">로그인하기</Link>
      </div>

      <div className="form__block">
        <input 
          type="submit" 
          value="회원가입" 
          className="form__btn--submit" 
          disabled={error?.length > 0} />
          {/* error의 크기가 0보다 클 때는 회원가입 버튼을 disabled 해야함 */}
      </div>
    </form>
  );
}