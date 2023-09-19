import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Snackbar, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setLogout } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import  Axios from "axios";
import { useEffect, useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, onlineStatus,fromProfile, profileUser }) => {
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
  // const sameFriends = fromProfile===true?userFriends.find(({ sid }) => friendId === sid):
  const [sameFriends, setSameFriends] = useState(false)
  
 console.log("userIsSameAsFriend ccheck",sameFriends);

 const [open, setOpen] = useState(false);

 const handleClick = () => {
   setOpen(true);
 };

 const handleClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }

   setOpen(false);
 };

 const sendFriendRequest = async () => {
  console.log("calling sendFriendRequest")
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
 handleClick();
 sendNotification(fromProfile===true?friendId:sid,"Sent you a friend Request")
 handleClick()
} catch (error) {
  console.error("Error fetching data: ", error);
  if(error.code=="ERR_NETWORK"){
    // window.alert("Session Expired Please login again")
    dispatch(setLogout());
    navigate("/");
  }
}
}

  const getFriends = async () => {
    try{const response = await Axios.get(window.API_URL+"/users/friends", {
      params:{
        id:sid,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("resoinsedata ",response.data);
    const data = await response.data;
    console.log("from profile in friend",fromProfile===undefined)
    if(fromProfile===undefined){
      dispatch(setFriends({ friends: data }));
    }
    setUserFriends(data);
    const hasSameSid = friends.some(friend => data.some(userFriend => userFriend.sid === friend.sid));
    console.log("userFriends ",data)
    setSameFriends(hasSameSid);
    console.log("sameFriends in friends",sameFriends)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };

  const sendNotification = (sid,title) => {
    try {
      Axios.post(window.API_URL+"/firebase/send-friend-request-notification", {"title":title,"userId":sid}, {
        params: {
          friendId: friendId
        },
        headers: {
          Authorization: "Bearer " + token.token,
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

  const patchFriend = async (friendId) => {
    console.log("calling patchFriend")
    try {
    const response = await Axios.get(window.API_URL+"/patchFriend", {
      params:{
        id:sid,
        friendId:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("patch friend data ",response);
    const data = await response.data.friend;
      if(!fromProfile){
        dispatch(setFriends({ friends: data }));
      }else{
        getFriends();
      }
    getFriends();
    sendNotification(sid,"Unfriended By")
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };

  useEffect(() => {
    console.log("getUserFriends in Friend")
    getFriends()
  }, [])
  
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
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
          {onlineStatus===true?"online":"offline"}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween>
{friendId !==sid ? (
          <IconButton
            // onClick={() => patchFriend()}
            
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            { sameFriends ? (
             
            //  fromProfile? <PersonAddOutlined sx={{ color: primaryDark }} onClick={() =>sendFriendRequest()} />
             <PersonRemoveOutlined sx={{ color: primaryDark }} onClick={() =>patchFriend(friendId)  } />
            ) : (
              // fromProfile?<PersonRemoveOutlined sx={{ color: primaryDark }} onClick={() =>patchFriend(friendId)  } />:
              <PersonAddOutlined sx={{ color: primaryDark }} onClick={() =>sendFriendRequest()} />
            )}
          </IconButton>
        ) : (
          ""
        )}
        <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Friend Request sent"
      />
      </FlexBetween>
    </FlexBetween>
  );
};

export default Friend;
