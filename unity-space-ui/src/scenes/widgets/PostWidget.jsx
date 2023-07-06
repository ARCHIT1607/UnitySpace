import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import  Axios from "axios";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import Post from "components/Post";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost, setPosts } from "state";

const PostWidget = ({
  postId,
  userId,
  name,
  description,
  location,
  picture,
  picturePath,
  userPicturePath,
  likes,
  comments,
  fromProfile
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.sid);
  const isLiked = likes?Boolean(likes.includes(loggedInUserId)):false;
  // const likeCount = likes?Object.keys(likes).length:0;
  const likeCount = likes?likes.split(",").length:0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  

  const patchLike = async () => {
    const response = await Axios.post("http://localhost:9000/posts/like", null, {
      params: {
        postId: postId,
        userId:loggedInUserId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    const updatedPost = await response.data;
    dispatch(setPost({ post: updatedPost }));
    // window.location.reload(false);
    getPosts();

    if(fromProfile){
      getUserPosts();
    }
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

  
  

  console.log("postUserId in postwidget ",userId, name)
  return (
    <WidgetWrapper m="2rem 0">
      <Post
        friendId={userId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
        fromProfile={fromProfile}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && picturePath.includes(".mp4") ? (
        <video
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          controls
          src={`http://localhost:9000/post/image/${picturePath}`}
        />
      ):(
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:9000/post/image/${picturePath}`}
        />)} 
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments&&comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
