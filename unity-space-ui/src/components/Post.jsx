import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Typography, useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, 
  Button,
  TextField,
  Snackbar} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setLogout, setPosts } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import Axios from "axios";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import badWords from 'bad-words';
import DetectImageExplicitContent from "components/DetectImageExplicitContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  fromProfile,
  course,
  description
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sid } = useSelector((state) => state.user);
  const  friends  = useSelector((state) => state.user.friends);
  const token = useSelector((state) => state.token);
  const [userFriends, setUserFriends] = useState([])

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  console.log("friendId ",friendId)
  console.log("userFriends in post ",userFriends)
  console.log("fromProfile in post ",fromProfile)
  let sameFriends = fromProfile===true?userFriends.find(({ sid }) => friendId === sid):
  friends.find(({ sid }) => friendId === sid);
 console.log("sameFriends in post ",sameFriends)
 const [newDescription, setNewDescription] = useState(description);
  const [picture, setPicture] = useState(null);
const [isHate, setIsHate] = useState(false)
const [openSnackbar, setOpenSnackbar] = useState(false);

 const handleSnackbarClick = () => {
  setOpenSnackbar(true);
 };

 const handleSnackbarClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }

   setOpenSnackbar(false);
 };


const ITEM_HEIGHT = 48;

const sendNotification = async (sid) => {
  try {
    const response = await Axios.post(window.API_URL+"/firebase/send-friend-request-notification", {"title":"Sent you a friend Request","userId":sid}, {
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("send notification for send friend request notification ", response)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
};

  const patchFriend = async () => {
    console.log("calling patchFriend");
    try{const response = await Axios.get(window.API_URL+"/patchFriend", {
      params: {
        id: fromProfile===true?friendId:sid,
        friendId: fromProfile===true?sid:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("patch friend data ", response);
    const data = await response.data.friend;
    if (friendId !== sid) {
      dispatch(setFriends({ friends: data }));
    }
    // setUserFriends(data);

    getFriends()
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };

  const getFriends = async () => {
    try{
      const response = await Axios.get(window.API_URL+"/users/friends", {
      params:{
        id:sid,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("resoinsedata ",response.data);
    const data = await response.data;
    console.log("from profile ",fromProfile)
    setUserFriends(data);
    console.log("userFriends ",data)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };


  const deletePost = async () => {
    console.log("calling deletePost");
    try{const response = await Axios.get(window.API_URL+"/delete/post", {
      params: {
        postId: postId,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("deletePost data ", response);
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
    console.log("fromProfile data ", fromProfile);
    if (fromProfile) {
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
  }

  const handleDescriptionChange = (event) => {
    const filter = new badWords();
    filter.removeWords("hell");
    const newText = event.target.value ? event.target.value : '';
    if(filter.isProfane(newText)){
      toast("Inappropriate Content detected");
      setNewDescription("")
    }else{
      setNewDescription(newText);
    }
  };

  const handlePictureChange = async (event) => {
    const file = event.target.files[0];
    // const result = file.type.startsWith("image/")?await detectExplicitContent(event.target.files[0],"image"):
    const result = await DetectImageExplicitContent(event.target.files[0]);
    if(result[0].nsfw_likelihood>=5){
     setIsHate(true)
    }else{
      setPicture(event.target.files[0]);
      setIsHate(false)
    }
    
  };

  const updatePost = async () => {
    console.log("calling updatePost");
    const formData = new FormData();
    if (picture) {
      formData.append("picture", picture);
      formData.append("pictureName", picture.name);
    }
    if(isHate){
      window.alert(
        "inappropriate content detected. Please refrain from spreading negativity"
      );
      setPicture(null);
      handleClose(false);
    } else {
      try{const response = await Axios.post(window.API_URL+"/updatePost", formData,{
        params: {
          postId: postId,
          description:newDescription
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("updatePost data ", response);
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
      console.log("fromProfile data ", fromProfile);
      if (fromProfile) {
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
    handleClose(false);
    }
  }

  const getUserPosts = async () => {
    try{const response = await Axios.get(
      window.API_URL+`/posts/${sid}/posts`,
      {
        headers: { Authorization: "Bearer " + token.token },
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

  const sendFriendRequest = async () => {
    console.log("calling patchFriend")
    try {
    const response = await Axios.post(window.API_URL+"/users/sendFriendRequest",null, {
      params:{
        senderId:sid,
        friendId:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("sendFriendRequest ",response);
    sendNotification(fromProfile===true?friendId:sid)
    handleSnackbarClick()
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  }

  useEffect(() => {
    console.log("getUserFriends in Post")
    getFriends()
  }, [friends])


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.main,
                cursor: "pointer",
              },
            }}
          >
            {name} <span style={{ fontSize: "0.75rem" }}>({course})</span>
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Post section"}
        </DialogTitle>
        <DialogContent>
        <TextField
              id="standard-basic"
              label="Description"
              variant="standard"
              sx={{ width: "80%" }}
              value={newDescription}
              onChange={handleDescriptionChange}
              required
            />
            <Box m={"2rem"}></Box>
            <input type="file" onChange={handlePictureChange} />
            <Box m={"2rem"}></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={updatePost}>Update Post</Button>
        </DialogActions>
      </Dialog>
      <IconButton>
      {friendId ===sid?<EditIcon onClick={handleClickOpen}/>:""}
      </IconButton> 
      {friendId !==sid ? (
          <IconButton
            
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            { sameFriends ? (
             
               <PersonRemoveOutlined sx={{ color: primaryDark }} onClick={() => patchFriend()} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} onClick={() =>sendFriendRequest()} />
            )}
          </IconButton>
        ) : <IconButton
        onClick={() => deletePost()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        <DeleteIcon></DeleteIcon>
        </IconButton>}
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Friend Request Sent"
      />
      </FlexBetween>
    </FlexBetween>
  );
};

export default Post;
