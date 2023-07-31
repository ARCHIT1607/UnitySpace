import { Box, TextField, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import Axios from "axios";
import ChatUser from "components/ChatUser";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "components/firebase";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";

const ChatListWidget = ({ userId,userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

console.log("friends ",friends);
  const getFriends = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
    
   
  };

  useEffect(() => {
    console.log("calling")
    getFriends();
    console.log("friends ",friends)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = friends.filter((friend) =>
  friend.fname.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign:"center" }}
      >
        Chats
      </Typography>
      <FlexBetween style={{justifyContent:"center"}} gap="1rem">
      <TextField
             value={searchTerm} onChange={handleChange}
             id="standard-basic"
             variant="standard"
             label="Search friends here"
            />
        </FlexBetween>
        <Box m="2rem 0"  />
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {filteredData && filteredData.map((friend) => (
          <ChatUser
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
};

export default ChatListWidget;
