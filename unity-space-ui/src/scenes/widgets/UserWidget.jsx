import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import EmailIcon from "@mui/icons-material/Email";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { setFriends, setLogout, setOnlineStatus } from "state";

const UserWidget = ({ userId, picturePath, fromProfile }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { email, _online_status } = useSelector((state) => state.user);
  const sid = useSelector((state) => state.user.sid);
  const friends = useSelector((state) => state.user.friends);
  let impressions = useSelector((state) => state.posts);
  impressions = impressions.find(({ postUserId }) => sid === postUserId);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  console.log("picturePath in UserWidget ", picturePath);
  const [userFriends, setUserFriends] = useState([]);
console.log("_online_status ",_online_status.toString())

  const [checked, setChecked] = useState(_online_status);
  // setChecked(_online_status)
  console.log("checked ",checked)
  const handleChange = (event) => {
    setChecked(event.target.checked);
    if(checked){
      updateOnlineStatus(false,sid)
    }else{
      updateOnlineStatus(true,sid)
    }
  }

    const updateOnlineStatus = async (status,sid) => {
      const response = await Axios.post(window.API_URL+"/updateOnlineStatus", null, {
      params: {
        status: status,
        userId:sid
      },
      headers: {
        Authorization: "Bearer " +  token.token,
      },
    });
    console.log("response in updateOnlineStatus response", response.data)
    dispatch(setOnlineStatus(response.data._online_status))
    setChecked(response.data._online_status)
  }

  const patchFriend = async () => {
    console.log("calling patchFriend ", userId);
    try {
      const response = await Axios.get(window.API_URL+"/patchFriend", {
        params: {
          id: userId,
          friendId: sid,
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("patch friend data ", response);
      const data = await response.data.friend;
      if (userId !== sid) {
        dispatch(setFriends({ friends: data }));
      }

      getFriends();
    } catch (error) {
      console.error("Error fetching data: ", error);
      if (error.code == "ERR_NETWORK") {
        // window.alert("Session Expired Please login again");
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const getFriends = async () => {
    try {
      const response = await Axios.get(window.API_URL+"/users/friends", {
        params: {
          id: sid,
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("resoinsedata ", response.data);
      const data = await response.data;
      console.log("from profile in friend", userId === undefined);
      if (userId === undefined) {
        dispatch(setFriends({ friends: data }));
      }
      setUserFriends(data);
      console.log("userFriends ", data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      if (error.code == "ERR_NETWORK") {
        // window.alert("Session Expired Please login again");
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const getUser = async () => {
    try {
      const response = await Axios.get(window.API_URL+"/getUser", {
        params: {
          userId: userId,
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("response in getUser ", response.data);
      const data = response;
      setUser(response.data);
      dispatch(setOnlineStatus(response.data._online_status));
      console.log("user in userWidget ", user);
    } catch (error) {
      console.error("Error fetching data: ", error);
      if (error.code == "ERR_NETWORK") {
        // window.alert("Session Expired Please login again");
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const sendNotification = async (sid) => {
    try {
      const response = await Axios.post(window.API_URL+"/firebase/send-friend-request-notification", {"title":"Sent you a friend Request","userId":sid}, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("send notification for send friend request notification ", response)
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        // window.alert("Session Expired Please login again")
        dispatch(setLogout());
        navigate("/");
      }
    }
  };

  const sendFriendRequest = async () => {
    console.log("calling sendFriendRequest from userWIdget")
    try {
    const response = await Axios.post(window.API_URL+"/users/sendFriendRequest",null, {
      params:{
        senderId:sid,
        friendId:userId
      },
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
    console.log("sendFriendRequest ",response);
    sendNotification(sid)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  }

  useEffect(() => {
    // getFriends();
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (impressions !== 0) {
      // Perform any necessary actions when the count changes
      getUser();
      console.log("impressions has changed:", impressions);
    }
  }, [friends, impressions]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }


  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <UserImage image={picturePath != null ? picturePath : ""} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.main,
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate(`/profile/${userId}`)}
            >
              {user.fname} {user.lname}
            </Typography>
            <Typography color={medium}>
              {user.friends.length} friends
            </Typography>
            {userId===sid?<FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Online"
              />
            </FormGroup>:_online_status===true?"online":"offline"}
          </Box>
        </FlexBetween>
        {userId !== sid ? (
          <ManageAccountsOutlined onClick={() => sendFriendRequest()} />
        ) : (
          ""
        )}
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
            <a
              href="https://teams.microsoft.com/l/call/0/0?users=asm63@student.le.ac.uk"
              target="_blank"
            >
              <VideoChatIcon fontSize="large" />
            </a>
            <Box>
              <a href={"mailto:" + email} target="_blank">
                <EmailIcon fontSize="large" />
              </a>
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
