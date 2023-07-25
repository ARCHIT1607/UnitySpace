import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import  Axios from "axios";
import { useEffect } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, onlineStatus,profileUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sid } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  console.log("friends ",friends)
  console.log("friendId ",friendId.sid)
  // const isFriend = friends&&friends.sid === friendId;
  const isFriend = friends.find(({ sid }) => friendId === sid);

 console.log("isfriend ",friends.find(({ sid }) => console.log(friendId === sid)));

  const patchFriend = async () => {
    console.log("calling patchFriend")
    const response = await Axios.get("http://localhost:9000/users", {
      params:{
        id:profileUser!=null?profileUser:sid,
        friendId:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("patch friend data ",response);
    const data = await response.data.friend;
    dispatch(setFriends({ friends: data }));
  };

  // const getFriends = async () => {
  //   console.log("token ",token)
  //   const response = await Axios.get("http://localhost:9000/users/friends", {
  //     params:{
  //       id:sid,
  //     },
  //     headers: {
  //       Authorization: "Bearer " + token.token,
  //     },
  //   });
  //   console.log("resoinsedata ",response.data);
  //   const data = await response.data;
  //   dispatch(setFriends({ friends: data }));
  //   console.log("in getAllBills");
    
   
  // };

  // useEffect(() => {
  //   console.log("calling")
  //   getFriends();
  //   console.log("friends ",friends)
  // }, []); 

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
{console.log("friendId !==sid ",friendId !==sid)}
{console.log("isFriendd ",isFriend)}
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {friendId !==sid ? 
        isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        ): <PersonRemoveOutlined sx={{ color: primaryDark }} />}
      </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Friend;
