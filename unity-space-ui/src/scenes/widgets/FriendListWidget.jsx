import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import Axios from "axios";

const FriendListWidget = ({ userId,userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);

  const getFriends = async () => {
    console.log("token ",token)
    const response = await Axios.get("http://localhost:9000/users/friends", {
      params:{
        id:sid,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("resoinsedata ",response.data);
    const data = await response.data;
    dispatch(setFriends({ friends: data }));
    console.log("in getAllBills");
    
   
  };

  useEffect(() => {
    console.log("calling")
    getFriends();
    console.log("friends ",friends)
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
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
