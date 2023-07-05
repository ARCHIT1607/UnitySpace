import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import  Axios from "axios";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await Axios.get("http://localhost:9000/getPosts",{
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    const data = response.data;
    console.log("data from getPosts ",data)
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await Axios.get(
      `http://localhost:9000/posts/${userId}/posts`,
      {
        headers: { Authorization: "Bearer " + token.token},
      }
    );
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // console.log("posts ",posts[0].postUserId,`${posts[0].firstname} ${posts[0].lastname}`)
  return (
    <>
      {posts && posts.map(
        ({
          id,
          postUserId,
          firstname,
          lastname,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={id}
            postId={id}
            userId={postUserId}
            name={firstname + " "+ lastname}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
