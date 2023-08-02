import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
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
  const sameFriends = fromProfile===true?userFriends.find(({ sid }) => friendId === sid):
  friends.find(({ sid }) => friendId === sid);

 console.log("userIsSameAsFriend ccheck",sameFriends);

  const patchFriend = async () => {
    console.log("calling patchFriend")
    try {
    const response = await Axios.get("http://localhost:9000/patchFriend", {
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
    if(profileUser===sid)
    {
      dispatch(setFriends({ friends: data }));
    }
    
    getFriends();
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      navigate("/");
    }
  }
  };

  const getFriends = async () => {
    try{const response = await Axios.get("http://localhost:9000/users/friends", {
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
    console.log("userFriends ",data)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
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
                color: palette.primary.light,
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
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            { sameFriends ? (
             
               <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        ) : (
          ""
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Friend;
