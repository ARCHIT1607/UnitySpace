import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useEffect } from "react";
import { messaging } from "components/firebase";
import { getToken, onMessage  } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const HomePage = () => {

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { sid, picturePath } = useSelector((state) => state.user);

  const addFirebaseToken = async (token) => {

    const response = await fetch("http://localhost:9000/firebase/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"userId":sid,"firebase_token":token}),
  });
 console.log(response);
};

  async function requestPermission (){
    const permission = await Notification.requestPermission();
      if(permission === "granted"){
        const token = await getToken(messaging,{vapidKey:'BBCz-opcNloxx-lcHRMg5OT82peYLYgh7RGZlzHeWRhUH64GqDVh-0bwVLEKzqUQfUncsCrdjZdEpufJrdui1L0'})
        console.log(token)
        addFirebaseToken(token);
      }else if(permission === "denied"){
alert("You denied for the notification")
      }

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received', payload);
        toast(`${payload.notification.body} ${payload.notification.title} `)
      });
      return () => {
        unsubscribe();
      };

    }
    useEffect( () => {
      requestPermission()
    },[] )

console.log("user ",sid);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={sid} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={sid} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={sid} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
