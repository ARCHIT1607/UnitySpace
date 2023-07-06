import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setPosts } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import  Axios from "axios";
import { useEffect } from "react";

const Post = ({ friendId, name, subtitle, userPicturePath,postId,fromProfile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sid } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  console.log("friends ",friends)
  console.log("friendId ",friendId.sid)
  // const isFriend = friends&&friends.sid === friendId;
  const isFriend = friends.find(({ sid }) => friendId === sid);

 console.log("isfriend ",friends.find(({ sid }) => console.log(friendId === sid)));
 console.log("fromProfile data ",fromProfile);
  const patchFriend = async () => {
    console.log("calling patchFriend")
    const response = await Axios.get("http://localhost:9000/users", {
      params:{
        id:sid,
        friendId:friendId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("patch friend data ",response);
    const data = await response.data.friend;
    dispatch(setFriends({ friends: data }));
  };

  const deletePost = async () => {
    console.log("calling deletePost")
    const response = await Axios.get("http://localhost:9000/delete/post", {
      params:{
        postId:postId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("deletePost data ",response);
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
    console.log("fromProfile data ",fromProfile);
    if(fromProfile){
      getUserPosts();
    }
  };

  const getUserPosts = async () => {
    const response = await Axios.get(
      `http://localhost:9000/posts/${sid}/posts`,
      {
        headers: { Authorization: "Bearer " + token.token},
      }
    );
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

//   const getFriends = async () => {
//     console.log("token ",token)
//     const response = await Axios.get("http://localhost:9000/users/friends", {
//       params:{
//         id:sid,
//       },
//       headers: {
//         Authorization: "Bearer " + token.token,
//       },
//     });
//     console.log("resoinsedata ",response.data);
//     const data = await response.data;
//     dispatch(setFriends({ friends: data }));
//     console.log("in getAllBills");
    
   
//   };

//   useEffect(() => {
//     console.log("calling")
//     getFriends();
//     console.log("friends ",friends)
//   }, []); 

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
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween>
        
      <IconButton
        onClick={() => deletePost()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      ><DeleteIcon /></IconButton>
      {friendId !==sid ? 
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
         {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
      :""}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Post;