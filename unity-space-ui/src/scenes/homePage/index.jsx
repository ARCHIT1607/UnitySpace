import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useEffect, useState } from "react";
import { messaging } from "components/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import createActivityDetector from "activity-detector";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { sid, pictureName } = useSelector((state) => state.user);
  const jwtToken = useSelector((state) => state.token.token);

  const addFirebaseToken = async (token) => {
    const response = await fetch("http://localhost:9000/firebase/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: sid, firebase_token: token }),
    });
    console.log(response);
  };

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BBCz-opcNloxx-lcHRMg5OT82peYLYgh7RGZlzHeWRhUH64GqDVh-0bwVLEKzqUQfUncsCrdjZdEpufJrdui1L0",
      });
      console.log(token);
      addFirebaseToken(token);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received", payload);
      toast(`${payload.notification.body} ${payload.notification.title} `);
    });
    return () => {
      unsubscribe();
    };
  }

  const updateOnlineStatus = async (status, userId) => {
    const response = await Axios.post(
      "http://localhost:9000/updateOnlineStatus",
      null,
      {
        params: {
          status: status,
          userId: userId,
        },
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
  };

  function useIdle(options) {
    const [isIdle, setIsIdle] = useState(false);
    useEffect(() => {
      const activityDetector = createActivityDetector(options);
      activityDetector.on("idle", () => setIsIdle(true));
      activityDetector.on("active", () => setIsIdle(false));
      return () => activityDetector.stop();
    }, []);
    return isIdle;
  }
  const isIdle = useIdle({ timeToIdle: 20000 });

  useEffect(() => {
    requestPermission();
    console.log("updateOnlineStatus from home page")
  }, []);

  if(isIdle){
    // window.alert("You there?")
    console.log("updateOnlineStatus if of idle")
    updateOnlineStatus(false, sid);
  }else{
    console.log("updateOnlineStatus else of idle")
    updateOnlineStatus(true, sid);
  }

  console.log("user ", sid);
  return (
    <Box>
      {isIdle ? "Are you still there?" : "Hello there!"}

      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={sid} picturePath={pictureName} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget
            picturePath={pictureName}
            userPicturePath={pictureName}
          />
          <PostsWidget userId={sid} userPicturePath={pictureName} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={sid} userPicturePath={pictureName} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
