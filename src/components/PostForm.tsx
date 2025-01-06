import { useContext, useEffect, useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CATEGORIES, CategoryType, PostProps } from "./PostList";

export default function PostForm() {
  const params = useParams(); //post id값을 추출
  const [post, setPost] = useState<PostProps | null>(null);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<CategoryType>("자기소개");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

   //getPost는 id값을 받도록 하기
    const getPost = async (id: string) => {
      if(id) { //id가 있다면
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        //console.log(docSnap?.data());
  
        setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
      }
    };
  
    //console.log(post);
  
    useEffect(() => {
      if (params?.id) getPost(params?.id); //params의 id가 있는 경우에만 getPost()를 호출하도록 하기
    }, [params?.id])

    //useEffect를 통해 만약 수정해야 할 데이터가 있으면 Form field에 넣어주도록 하기
    useEffect(() => {
      if (post) { //만약 post값이 있다면 (즉 수정을 위한 폼이라면)
        setTitle(post?.title);
        setSummary(post?.summary);
        setContent(post?.content);
        setCategory(post?.category as CategoryType);
      }
    }, [post]) //dependency Array에 Post를 추가

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post && post?.id) { // firestore로 데이터 수정 (post 데이터가 있다면)
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          title: title,
          summary: summary,
          content: content,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          category: category,
        });

        toast?.success("게시글을 수정했습니다.");
        navigate(`/posts/${post.id}`);

      } else { //firestore로 데이터 생성하는 로직
        await addDoc(collection(db, "posts"), {
          title: title,
          summary: summary,
          content: content,
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
          category: category,
        });
  
        toast?.success("게시글을 생성했습니다.");
        navigate("/");
      }
    } catch(e: any) {
      console.log(e);
      toast?.error(e?.code);
    }
  };

  //console.log(title, summary, content); //잘 적용되는지 확인
  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >) => {
    const {
      target: {name, value},
    } = e;

    if (name === "title") {
      setTitle(value);
    }

    if (name === "summary") {
      setSummary(value);
    }

    if (name === "content") {
      setContent(value);
    }

    if (name === "category") {
      setCategory(value as CategoryType);
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input type="text" name="title" id="title" required 
          onChange={onChange} value={title} />
      </div>

      <div className="form__block">
        <label htmlFor="category">카테고리</label>
        <select
          name="category"
          id="category"
          onChange={onChange}
          defaultValue={category}>
            <option value="">카테고리를 선택해주세요</option>
            {CATEGORIES?.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div className="form__block">
        <label htmlFor="summary">요약</label>
        <input type="text" name="summary" id="summary" required 
          onChange={onChange} value={summary} />
      </div>

      <div className="form__block">
        <label htmlFor="content">내용</label>
        <textarea name="content" id="content" required 
          onChange={onChange} value={content} />
      </div>

      <div className="form__block">
        <input type="submit" value={post? '수정' : '제출'} className="form__btn--submit" />
      </div>
    </form>
  );
}