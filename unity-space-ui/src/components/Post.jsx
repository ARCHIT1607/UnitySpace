import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setPosts } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import Axios from "axios";
import { useEffect, useState } from "react";

const Post = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  fromProfile,
  course
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sid } = useSelector((state) => state.user);
  const  friends  = useSelector((state) => state.user.friends);
  const token = useSelector((state) => state.token);
  const [userFriends, setUserFriends] = useState([])

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  console.log("friendId ",friendId)
  console.log("userFriends in post ",userFriends)
  console.log("fromProfile in post ",fromProfile)
  let sameFriends = fromProfile===true?userFriends.find(({ sid }) => friendId === sid):
  friends.find(({ sid }) => friendId === sid);
 console.log("sameFriends in post ",sameFriends)

  const patchFriend = async () => {
    console.log("calling patchFriend");
    try{const response = await Axios.get("http://localhost:9000/patchFriend", {
      params: {
        id: fromProfile===true?friendId:sid,
        friendId: fromProfile===true?sid:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("patch friend data ", response);
    const data = await response.data.friend;
    if (friendId !== sid) {
      dispatch(setFriends({ friends: data }));
    }
    
    // setUserFriends(data);
    getFriends()
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      window.alert("Session Expired Please login again")
      navigate("/");
    }
  }
  };

  const getFriends = async () => {
    try{
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
    console.log("from profile ",fromProfile)
    setUserFriends(data);
    console.log("userFriends ",data)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      window.alert("Session Expired Please login again")
      navigate("/");
    }
  }
  };


  const deletePost = async () => {
    console.log("calling deletePost");
    try{const response = await Axios.get("http://localhost:9000/delete/post", {
      params: {
        postId: postId,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("deletePost data ", response);
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
    console.log("fromProfile data ", fromProfile);
    if (fromProfile) {
      getUserPosts();
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      window.alert("Session Expired Please login again")
      navigate("/");
    }
  }
  };

  const getUserPosts = async () => {
    try{const response = await Axios.get(
      `http://localhost:9000/posts/${sid}/posts`,
      {
        headers: { Authorization: "Bearer " + token.token },
      }
    );
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      window.alert("Session Expired Please login again")
      navigate("/");
    }
  }
  };

  useEffect(() => {
    console.log("getUserFriends in Post")
    getFriends()
  }, [friends])

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name} <span style={{ fontSize: "0.75rem" }}>({course})</span>
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween>
      {friendId !==sid ? (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            { sameFriends ? (
             
               <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        ) : <IconButton
        onClick={() => deletePost()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        <DeleteIcon></DeleteIcon>
        </IconButton>}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Post;
