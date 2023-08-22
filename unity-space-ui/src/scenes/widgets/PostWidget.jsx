import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItem, ListItemText, TextField, Typography, useTheme } from "@mui/material";
import  Axios from "axios";
import FlexBetween from "components/FlexBetween";

import Post from "components/Post";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setLogout, setPost, setPosts } from "state";

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import badWords from 'bad-words';
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  userId,
  name,
  description,
  course,
  picture,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  fromProfile
}) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.sid);
  const isLiked = likes?Boolean(likes.includes(loggedInUserId)):false;
  // const likeCount = likes?Object.keys(likes).length:0;
  const likeCount = likes?likes.split(",").length:0;
console.log("user pic from home page ",userPicturePath)
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const navigate = useNavigate();

  const patchLike = async () => {
    try {
      const response = await Axios.post(window.API_URL+"/posts/like", null, {
      params: {
        postId: postId,
        userId:loggedInUserId
      },
      headers: {
        Authorization: "Bearer " + jwtToken.token,
      },
    });
    const updatedPost = await response.data;
    dispatch(setPost({ post: updatedPost }));
    // window.location.reload(false);
    getPosts();
    if(!isLiked){
      sendNotification(postId)
    }
    if(fromProfile){
      getUserPosts();
    }
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await Axios.get(
        window.API_URL+`/posts/${userId}/posts`,
        {
          headers: { Authorization: "Bearer " + jwtToken.token},
        }
      );
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const getPosts = async () => {
    try {
      const response = await Axios.get(window.API_URL+"/getPosts",{
        headers: {
          Authorization: "Bearer " + jwtToken.token,
        },
      });
      const data = response.data;
      console.log("data from getPosts ",data)
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        dispatch(setLogout());
        navigate("/");
      }
    }
  };


  const handleTextChange = (event) => {
    const filter = new badWords();
    filter.removeWords("hell");
    const newText = event.target.value ? event.target.value : '';
    if(filter.isProfane(newText)){
      toast("Inappropriate Content detected");
      setComment("")
    }else{
      setComment(newText);
    }
  };


  const postComment =async(e)=>{
    const formData = new FormData();
    formData.append("comment",comment)
    if(comment.startsWith(" ")){
      window.alert("please type something")
    }else{
      try {
        const response = await Axios.post(window.API_URL+"/postComment", formData, {
          params: {
            postId: postId,
            userId:loggedInUserId
          },
          headers: {
            Authorization: "Bearer " + jwtToken.token,
          },
        });
        const data = response.data;
        console.log("data from getPosts ",data)
        dispatch(setPosts({ posts: data }));
        setComment("");
      } catch (error) {
        console.error("Error fetching data: ", error);
        if(error.code=="ERR_NETWORK"){
          // window.alert("Session Expired Please login again")
          dispatch(setLogout());
          navigate("/");
        }
      }
    }
    
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

  const sendNotification = (postId) => {
    try {
      Axios.post(window.API_URL+"/firebase/send-notification", {"title":"Liked your post","userId":loggedInUserId}, {
        params: {
          postId: postId
        },
        headers: {
          Authorization: "Bearer " + jwtToken.token,
        },
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        dispatch(setLogout());
        navigate("/");
      }
    }
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
        course={course}
        fromProfile={fromProfile}
        description={description}
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
      ):picturePath?(
        <img
          width="100%"
          height="auto"
          
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:9000/post/image/${picturePath}`}
        />):picturePath
      } 
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
      <DialogContent dividers={scroll === 'paper'} style={{overflowY: 'auto', width:"400px"}}>
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
              {/* <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography> */}
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                  <ListItemText primary={
                    <Typography variant="h5" fontWeight="bold">
                    {comment.sid}
                  </Typography>} secondary={comment.comment}/>
                </ListItem>
                </List>         
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
            onChange={handleTextChange}
          />
        <Button onClick={postComment}>Add</Button>
      </DialogActions>
      </Dialog>
            <Typography>{comments&&comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      
    </WidgetWrapper>
  );
};

export default PostWidget;
