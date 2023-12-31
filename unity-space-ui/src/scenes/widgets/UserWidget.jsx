import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import VideoChatIcon from '@mui/icons-material/VideoChat';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  Axios from "axios";
import { setFriends } from "state";

const UserWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const {email} = useSelector((state) => state.user);
  const sid = useSelector((state) => state.user.sid);
  const friends = useSelector((state) => state.user.friends);
  let impressions = useSelector((state) => state.posts);
  impressions = impressions.find(({ postUserId }) => sid === postUserId);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  console.log("picturePath in UserWidget ",picturePath)
  const getUser = async () => {
    const response = await Axios.get("http://localhost:9000/getUser", {
      params:{
        userId:userId,
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("response in getUser ",response.data)
    const data = response;
    setUser(response.data);
    console.log("user in userWidget ",user)
  };

  useEffect(() => {
    // getFriends();
    getUser();
    
  }, [friends,impressions]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  // const {
  //   fname,
  //   lname,
  //   location,
  //   course,
  //   viewedProfile,
  //   impressions,
  //   friends,
  // } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath!=null?picturePath : ""} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {user.fname} {user.lname}
            </Typography>
            <Typography color={medium}>{user.friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user.loc}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user.course}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {user.viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {user.impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            {/* <img src="../assets/twitter.png" alt="twitter" /> */}
            <a href="https://teams.microsoft.com/l/call/0/0?users=asm63@student.le.ac.uk"
            target="_blank"><VideoChatIcon fontSize="large" /></a>
            <Box>
            <a href={"mailto:"+email}
            target="_blank"><EmailIcon fontSize="large" /></a>
             </Box>
          </FlexBetween>
        </FlexBetween>

        {/* <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween> */}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
