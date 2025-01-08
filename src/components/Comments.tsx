import React, { useContext, useState } from "react"
import { PostProps } from "./PostList";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";
import { db } from "firebaseApp";

interface CommentsProps {
  post: PostProps;
  getPost: (id: string) => Promise<void>;
}

export default function Comments({ post, getPost }: CommentsProps) {
  //console.log(post);
  const [comment, setComment] = useState("");
  const {user} = useContext(AuthContext); //현 user 받아오기
  
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: {name, value},
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post?.id) { //post가 있고, post.id가 유효하다면
        const postRef = doc(db, "posts", post.id);

        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            email: user.email,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };

          await updateDoc(postRef, {
            //comment는 배열 요소이므로 arrayUnion()으로 요소 추가
            comments: arrayUnion(commentObj),
            updatedAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          //문서 업데이트!
          await getPost(post.id);
        }
      }
      toast.success("댓글을 생성했습니다.");
      setComment(""); //comment 초기화
    } catch (e: any) {
      console.log(e);
      toast.error(e?.code);
    }
  };

  return (
  <div className="comments">
    <form className="comments__form" onSubmit={onSubmit}>
      <div className="form__block">
        <label htmlFor="comment">댓글 입력</label>
        <textarea 
          name="comment" 
          id="comment" 
          required 
          value={comment}
          onChange={onChange}
        />
      </div>
      <div className="form__block form__block-reverse">
        <input type="submit" value="입력" className="form__btn-submit" />
      </div>
    </form>

    <div className="comments_list">
    {post?.comments
      ?.slice(0)
      ?.reverse()
      ?.map((comment) => (
        <div key={comment.createdAt} className="comment_box">
          <div className="comment__profile-box">
            <div className="comment__email">{comment.email}</div>
            <div className="comment__date">{comment.createdAt}</div>
            <div className="comment__delete">삭제</div>
          </div>
          <div className="comment__text">{comment.content}</div>
        </div>
    ))}

    </div>

  </div>
  );
}