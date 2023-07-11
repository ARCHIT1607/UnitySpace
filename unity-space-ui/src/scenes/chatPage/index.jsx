import Navbar from 'scenes/navbar';
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chat from './Chat';
import ChatListWidget from 'scenes/widgets/ChatListWidget';

function ChatHomePage() {

    const [user, setUser] = useState(null);
  const { sid } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
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
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Box m="2rem 0" />
          <ChatListWidget userId={sid} fromChat={true} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "70%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          width="100%"
        >
            <Box m="2rem 0" />
         <Chat></Chat>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHomePage