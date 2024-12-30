import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { app } from "firebaseApp";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

export default function LoginForm() {
  //변수 값 저장
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // e.preventDefault()를 통해 기본 동작을 하지 않도록 작업

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("로그인에 성공했습니다.");
    } catch (error: any) {
      toast.error(error?.code);
      console.log(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value}, //name은 input의 name(email인지, password인지)
    } = e;

    if (name === 'email') {
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

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else {
        setError("");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="form form--lg">
      <h1 className="form__title">로그인</h1>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          required
          onChange={onChange}
          value={email} />
      </div>

      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          required
          onChange={onChange}
          value={password} />
      </div>

      {/* error가 있는 경우 error 내용 표시 */}
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}

      <div className="form__block"> 계정이 없으신가요? 
        <Link to="/signup" className="form__link">회원가입하기</Link>
      </div>

      <div className="form__block">
        <input 
          type="submit" value="로그인" className="form__btn--submit"
          disabled={error?.length > 0} />
          {/* error가 뜬 경우 로그인을 할 수 없도록 disabled */}
      </div>
    </form>
  );
}