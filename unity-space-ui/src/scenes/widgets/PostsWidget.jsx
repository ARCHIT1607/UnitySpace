import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import  Axios from "axios";
import { useNavigate } from "react-router-dom";

const PostsWidget = ({ userId, isProfile = false ,fromProfile, userPicturePath}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  console.log("user pic from home page in postsWidget ",userPicturePath)
  const navigate = useNavigate();


  const getPosts = async () => {
    try {
      const response = await Axios.get("http://localhost:9000/getPosts",{
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      const data = response.data;
      console.log("data from getPosts ",data)
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:9000/posts/${userId}/posts`,
        {
          headers: { Authorization: "Bearer " + token.token},
        }
      );
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };

  useEffect(() => {
    console.log("isProfile ",isProfile)
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


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
          picture,
          course,
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
            course={course}
            picture={picture}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            fromProfile={fromProfile}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
