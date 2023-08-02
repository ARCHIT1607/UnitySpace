import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  AddAlert
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { Navigate, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Axios from "axios";
import { useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Button } from "bootstrap";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const token = useSelector((state) => state.token);
  const fullName = `${user.fname} ${user.lname}`;

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCBHQ2PytqvWuk1RcoWshj57oxZf12l9yM",
  });

  const [userLocation, setUserLocation] = useState(null);

  const [data, setData] = useState([]);
  const getAllStudents = async () => {
    try {
      const response = await Axios.get("http://localhost:9000/allStudents", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("getAllStudents ", response.data);
      const data = response;
      setData(data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };

  const updateOnlineStatus = async (status,userId) => {
    const response = await Axios.post("http://localhost:9000/updateOnlineStatus", null, {
      params: {
        status: status,
        userId:user.sid
      },
      headers: {
        Authorization: "Bearer " +  token.token,
      },
    });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setUserLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  const deleteAccount = async () => {
    let confirm = window.confirm("Are you sure");
    if(confirm){
      try {
        const response = await Axios.post("http://localhost:9000/user/deleteAccount",
        null,
        {
          params: {
            user:user.sid
          },
          headers: {
            Authorization: "Bearer " + token.token,
          },
        });
        console.log("deleteAccount done", response.data);
        navigate("/");
      } catch (error) {
        console.error("Error fetching data: ", error);
        if(error.code=="ERR_NETWORK"){
          window.alert("Session Expired Please login again")
          navigate("/");
        }
      }
    }
  }

  const sendEmergency = async () => {
    try {
      const response = await Axios.post("http://localhost:9000/auth/emergencyCall",
      null,
      {
        params: {
          longitude: userLocation.longitude,
          latitude: userLocation.latitude,
          from:user.email
        },
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      console.log("sendEmergency done", response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      if(error.code=="ERR_NETWORK"){
        window.alert("Session Expired Please login again")
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getAllStudents();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
    
    
  }, []);

  const handleOptionChange = (event, value) => {
    console.log(`Selected option: ${value.fname}`);
    navigate(`/profile/${value.sid}`);
    navigate(0);
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          UnitySpace 
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            {/* <InputBase placeholder="Search..." /> */}
            <Stack spacing={2} sx={{ width: 300, border:"none" }}>
              <Autocomplete
              sx={{backgroundColor:{neutralLight}}}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                // options={data.map((student) => student.fname)}
                options={data}
                getOptionLabel={(student) => student.fname}
                getOptionSelected={(student, sid) =>
                  student.value === sid.value
                }
                onChange={handleOptionChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search people"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
            </Stack>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="1rem">
          {user.role==="ROLE_ADMIN"?<IconButton onClick={()=>{window.alert("sentimenatal analysis")}}>S A</IconButton>:""}
          <IconButton onClick={sendEmergency}><AddAlert></AddAlert></IconButton>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          
          <IconButton
            onClick={() => {
              navigate("/chat");
            }}
          >
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={deleteAccount }>
                  Delete Account
                </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  updateOnlineStatus(false,user.sid)
                  // updateOnlineStatus(false,user.sid)
                  navigate("/");
                }}
              >
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="1rem"
          >
            {user.role==="ROLE_ADMIN"?<IconButton onClick={()=>{window.alert("sentimenatal analysis")}}>S A</IconButton>:""}
            <IconButton onClick={sendEmergency}><AddAlert></AddAlert></IconButton>
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <
            IconButton
            onClick={() => {
              navigate("/chat");
            }}
          >
           <Message sx={{ fontSize: "25px" }} />
          </IconButton>
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={deleteAccount }>
                  Delete Account
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
