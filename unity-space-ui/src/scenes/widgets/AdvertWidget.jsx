import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Axios from "axios";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { setLogout } from "state";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const token = useSelector((state) => state.token);
  const [event, setEvent] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const dispatch = useDispatch();

  const events = [
    {
      title: "Event 1",
      start: new Date(2023, 6, 14, 10, 0),
      end: new Date(2023, 6, 14, 12, 0),
    },
    {
      title: "Event 2",
      start: new Date(2023, 6, 16, 14, 0),
      end: new Date(2023, 6, 16, 16, 0),
    },
  ];

  const getEvents = async () => {
    try {
      const response = await Axios.get(`http://localhost:9000/events`, {
        headers: { Authorization: "Bearer " + token.token },
      });
      setEvent(response.data);
      console.log("events ", response.data);
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
    getEvents();
  }, []);


  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Events
        </Typography>
      </FlexBetween>
      <Box p="0.5rem 0"></Box>
      {/* <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      /> */}

      {/* <h1>My Outlook Calendar</h1> */}
      {/* <Calendar localizer={localizer} events={events} /> */}

      {/* {event&&event.map((ev)=>(
       <FlexBetween><Typography color={dark} variant="h6" fontWeight="500">
        {ev.eventName}
        </Typography>
      <Typography color={dark} variant="h6" fontWeight="500">
        {ev.eventDate}
        </Typography>
      </FlexBetween>))} */}
       <FlexBetween>
       <Box sx={{ width: "100%", overflow: "auto", height:"25vh"}}>
          {event &&
            event.map((ev) =>
              ev.daysLeft <= 1 ? (
                <ListItem
                  sx={{
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    bgcolor: "red",
                  }}
                >
                  <ListItemText
                    primary={ev.eventName}
                    secondary={ev.eventDate}
                  />
                </ListItem>
              ) : (
                <ListItem
                  sx={{
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <ListItemText
                    primary={ev.eventName}
                    secondary={ev.eventDate}
                  />
                </ListItem>
              )
            )}
        </Box>
    </FlexBetween>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
