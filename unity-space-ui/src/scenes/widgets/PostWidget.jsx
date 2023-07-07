import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import  Axios from "axios";
import FlexBetween from "components/FlexBetween";

import Post from "components/Post";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPost, setPosts } from "state";


import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [comment, setComment] = useState("");
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

  const postComment =async()=>{
    const formData = new FormData();
    formData.append("comment",comment)
    const response = await Axios.post("http://localhost:9000/postComment", formData, {
      params: {
        postId: postId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    const data = response.data;
    console.log("data from getPosts ",data)
    dispatch(setPosts({ posts: data }));
  }
  
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);


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
            <IconButton onClick={handleClickOpen('paper')}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      ><DialogTitle id="scroll-dialog-title">Comment Section</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {comments && (
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Add Comment"
            type="comment"
            fullWidth
            variant="standard"
            value={comment}
            onChange={(e)=>{
              setComment(e.target.value);
            }}
          />
        <Button onClick={postComment}>Add</Button>
      </DialogActions>
      </Dialog>
            <Typography>{comments&&comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      
    </WidgetWrapper>
  );
};

export default PostWidget;
