import Navbar from 'scenes/navbar';
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chat from './Chat';
import ChatListWidget from 'scenes/widgets/ChatListWidget';
import GroupListWidget from 'scenes/widgets/GroupListWidget';
import GroupChat from './GroupChat';

function ChatHomePage() {
  const [data, setData] = useState({ friendId: "",name:"",course:"",profilePic:"" });
    const [user, setUser] = useState(null);
  const { sid } = useSelector((state) => state.user);
  let currentChat = useSelector((state) => state.currentChat.currentChat);
  currentChat = typeof currentChat !== "undefined"?currentChat:data;
  let currentGroupChat = useSelector((state) => state.currentGroupChat.currentGroupChat);
  currentGroupChat = typeof currentGroupChat !== "undefined"?currentGroupChat:data;
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  console.log("currentChat in chathomepage ",currentChat)
  console.log("currentChat.friendId ",currentChat!=null&&currentChat.friendId)

  console.log("currentGroupChat in chathomepage ",currentGroupChat)
  console.log("currentGroupChat.member ",currentGroupChat!=null&&currentGroupChat.member)
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="flex-start"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} >
          <Box m="2rem 0"  />
          <ChatListWidget userId={sid} fromChat={true} />
          <Box m="2rem 0"  />
          <GroupListWidget userId={sid} fromChat={true} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "70%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          width="100%"
        >
            <Box m="2rem 0" />
         {currentChat.friendId&&<Chat friendId={currentChat.friendId}
          pictureName={currentChat.profilePic} name={currentChat.name} course={currentChat.course} />}
          {currentGroupChat&&<GroupChat
          pictureName={currentGroupChat.profilePic} name={currentGroupChat.name} member={currentGroupChat.member} />}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHomePage