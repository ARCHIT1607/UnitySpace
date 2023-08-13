import { Box, useMediaQuery } from "@mui/material";
import  Axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { setLogout } from "state";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { sid } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const friends = useSelector((state) => state.user.friends);
  console.log("friends in index ",friends)
  const onlineStatus = friends.filt
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const getUser = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:9000/user", {
          params:{
            userId:userId,
            sid:sid
          },
          headers: {
            Authorization: "Bearer " + token.token,
          },
        });
      const data = response.data;
      setUser(data);
      console.log("picturePath in ProfilePage ",user)
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
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.pictureName} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} fromProfile={true}/>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userId===sid?<MyPostWidget picturePath={user.pictureName} fromProfile ={true} />:""}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile fromProfile={true}/>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
