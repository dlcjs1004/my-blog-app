import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";

interface PostListProps {
  hasNavigation?: boolean;
  defaultTab?: TabType | CategoryType;
}

export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  uid: string;
  category?: CategoryType;
}
type TabType = "all" | "my"; //TabType 정의(전체/나의 글)

export type CategoryType = "자기소개" | "고민" | "커뮤니티" | "상담";
export const CATEGORIES: CategoryType[] = [
  "자기소개",
  "고민", 
  "커뮤니티", 
  "상담", 
];

export default function PostList({
  hasNavigation = true,
  defaultTab = "all",
}: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType | CategoryType>(defaultTab); //기본은 "전체"
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    setPosts([]); //posts 초기화 (중복쌓임 방지차원)
    // post 생성순대로 정렬
    let postsRef = collection(db, "posts");
    let postsQeury;
    
    //activeTab 관련
    if (activeTab === "my" && user) { //나의 글만 필터링
      postsQeury = query(
          postsRef, 
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
    } else if (activeTab === "all") { // 모든 글 보여주기
      postsQeury = query(postsRef, orderBy("createdAt", "desc"));
    } else { //category 글보여주기
      postsQeury = query(
        postsRef, 
        where("category", "==", activeTab),
        orderBy("createdAt", "desc")
      );
    }

    const datas = await getDocs(postsQeury);
    datas?.forEach((doc) => {
      //console.log(doc.data(), doc.id);
      const dataObj = {...doc.data(), id: doc.id}; //doc의 데이터를 모두 가져오고, id는 doc의 id로 따로 합치기
      setPosts((prev) => [...prev, dataObj as PostProps]); //이전 데이터 Prev를 추가하고, 그 다음에 dataObj를 마지막에 추가하는 방식
      //setPosts(dataObj);라고 썼으면 마지막 dataObj만 끌어옴
    });
  };

  useEffect(() => {
    getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); //activeTab이 변할 때마다 getPosts() 호출

  const handleDelete = async (id:string) => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && id) {
      await deleteDoc(doc(db, "posts", id));
      toast.success("게시글을 삭제했습니다.");
      getPosts(); //변경된 posts 리스트를 다시 가져오도록
    }
  };

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
        {CATEGORIES?.map((category) => (
          <div 
          key={category}
          role="presentation" 
          onClick={() => setActiveTab(category)}
          className={activeTab == category ? "post__navigation--active" : ""}
          >
            {category}
        </div>
        ))}
      </div>
    )}

    <div className="post__list">
      {posts?.length > 0 ? posts?.map((post, index) => ( //posts의 length가 0보다 클 때 posts 매핑
        <div key={post?.id} className="post__box">
          <Link to={`/posts/${post?.id}`}>
            <div className="post__profile-box">
              <div className="post__profile" />
              <div className="post__author-name">{post?.email}</div>
              <div className="post__date">{post?.createdAt}</div>
            </div>
            <div className="post__title">{post?.title}</div>
            <div className="post__text">{post.summary}</div>
          </Link>

{/* post의 email과 user의 email이 같을 경우에만 보여주기 */}
            {post?.email === user?.email && (
              <div className="post__utils-box">
                <div 
                  className="post__delete"
                  role="presentation"
                  onClick={() => handleDelete(post.id as string)}
                >
                  삭제
                </div>
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
