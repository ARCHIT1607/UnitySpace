import { Box, Typography, useTheme } from "@mui/material";
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

const ChatListWidget = ({ userId,userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);
console.log("friends ",friends);
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

  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign:"center" }}
      >
        Friends
      </Typography>
      {/* <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {friends.map((friend) => (
            <MenuItem key={friend.fname} value={friend.fname}>
              <Checkbox checked={personName.indexOf(friend.fname) > -1} />
              <ListItemText primary={friend.fname} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button onClick={console.log("selected users ",personName)}>Click</button> */}
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.map((friend) => (
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
