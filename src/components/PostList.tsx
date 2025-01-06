import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";

interface PostListProps {
  hasNavigation?: boolean;
}

type TabType = "all" | "my"; //TabType 정의(전체/나의 글)

export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createAt: string;
  updatedAt?: string;
  uid: string;
}

export default function PostList({hasNavigation = true}: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all"); //기본은 "전체"
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const datas = await getDocs(collection(db, "posts"));
    datas?.forEach((doc) => {
      //console.log(doc.data(), doc.id);
      const dataObj = {...doc.data(), id:doc.id}; //doc의 데이터를 모두 가져오고, id는 doc의 id로 따로 합치기
      setPosts((prev) => [...prev, dataObj as PostProps]); //이전 데이터 Prev를 추가하고, 그 다음에 dataObj를 마지막에 추가하는 방식
      //setPosts(dataObj);라고 썼으면 마지막 dataObj만 끌어옴
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
    {hasNavigation && (
      <div className="post__navigation">
        <div 
          role="presentation" 
          onClick={() => setActiveTab("all")}
          className={activeTab == "all" ? "post__navigation--active" : ""}>
            전체
        </div>
        <div 
          role="presentation" 
          onClick={() => setActiveTab("my")}
          className={activeTab == "my" ? "post__navigation--active" : ""}>
            나의 글
        </div>
      </div>
    )}

    <div className="post__list">
      {posts?.length > 0 ? posts?.map((post, index) => ( //posts의 length가 0보다 클 때 posts 매핑
        <div key={post?.id} className="post__box">
          <Link to={`/posts/${post?.id}`}>
            <div className="post__profile-box">
              <div className="post__profile" />
              <div className="post__author-name">{post?.email}</div>
              <div className="post__date">{post?.createAt}</div>
            </div>
            <div className="post__title">{post?.title}</div>
            <div className="post__text">{post.summary}</div>
          </Link>

{/* post의 email과 user의 email이 같을 경우에만 보여주기 */}
            {post?.email === user?.email && (
              <div className="post__utils-box">
                <div className="post__delete">삭제</div>
                  <Link to={`/posts/edit/${post?.id}`} className="post__edit">
                    수정
                  </Link>
            </div>
            )}
            
        </div>  
      )) : (
        <div className="post__no-post">게시글이 없습니다.</div>
      ) }
    </div>
    </>
  );
}
