import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setLogout } from "state";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const FriendListWidget = ({ userId,userPicturePath,fromProfile }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);
  const navigate = useNavigate();


  const getFriends = async () => {
    console.log("token ",token)
    try {
      const response = await Axios.get("http://localhost:9000/users/friends", {
        params:{
          id:userId,
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("resoinsedata ",response.data);
      const data = await response.data;
      dispatch(setFriends({ friends: data }));
      console.log("in getAllBills");
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
    // console.log("calling")
    getFriends();
    // console.log("friends ",friends)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.map((friend) => (
          <Friend
            key={friend.sid}
            friendId={friend.sid}
            name={`${friend.fname} ${friend.lname}`}
            subtitle={friend.course}
            userPicturePath={friend.picture_name}
            onlineStatus={friend.onlineStatus}
            profileUser={userId}
            fromProfile={fromProfile}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
