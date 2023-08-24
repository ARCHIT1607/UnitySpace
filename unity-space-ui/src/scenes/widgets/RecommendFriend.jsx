import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setLogout } from "state";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function RecommendFriend(counter) {

    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);
    const { sid,course,fname  } = useSelector((state) => state.user);
    const navigate = useNavigate();
    console.log("counter value in friendListWidget ",counter)
    const [data, setData] = useState()
    
  
    const getRecommendation = async () => {
      console.log("getRecommendation token ",token)
      try {
        const response = await Axios.get(window.API_URL+"/users/recommendation", {
          params:{
            course:course
          },
          headers: {
            Authorization: "Bearer " + token.token,
          },
        });
        console.log("getRecommendation ",response.data);
        const data = await response.data;
        const filteredData = data.filter(item => {
            return !friends.some(obj => obj.fname === item.fname && obj.lname === item.lname || item.fname === fname);
          });
          
          console.log(filteredData);
        setData(filteredData);
        console.log("in getRecommendation");
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
      getRecommendation();
      // console.log("friends ",friends)
    }, [counter]); // eslint-disable-line react-hooks/exhaustive-deps
 return (
    <WidgetWrapper>
    <Typography
      color={palette.neutral.dark}
      variant="h5"
      fontWeight="500"
      sx={{ mb: "1.5rem" }}
    >
      Recommendation
    </Typography>
    <Box display="flex" flexDirection="column" gap="1.5rem">
      {data && data.map((friend) => (
        <Friend
          key={friend.sid}
          friendId={friend.sid}
          name={`${friend.fname} ${friend.lname}`}
          subtitle={friend.course}
          userPicturePath={friend.picture_name}
          onlineStatus={friend.onlineStatus}       
        />
      ))}
    </Box>
  </WidgetWrapper>
  );
}

export default RecommendFriend