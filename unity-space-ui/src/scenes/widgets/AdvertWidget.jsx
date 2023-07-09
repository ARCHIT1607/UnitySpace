
import { ListItem, ListItemButton, ListItemText, TextField, Typography, useTheme } from "@mui/material";
import  Axios  from "axios";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";


const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const token = useSelector((state) => state.token);
  const [event, setEvent] = useState()
  const [selectedDate, setSelectedDate] = useState(null);


  const getEvents = async () => {
    const response = await Axios.get(
      `http://localhost:9000/events`,
      {
        headers: { Authorization: "Bearer " + token.token},
      }
    );
    setEvent(response.data);
    console.log("events ",response.data)
  };

  useEffect(() => {
    getEvents()
  }, [])

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Events
        </Typography>
        <Typography color={medium}>
          <a href="">View Events</a> </Typography>
      </FlexBetween>
      {/* <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      /> */}
      {event&&event.map((ev)=>(
       <FlexBetween><Typography color={dark} variant="h6" fontWeight="500">
        {ev.eventName}
        </Typography>
      <Typography color={dark} variant="h6" fontWeight="500">
        {ev.eventDate}
        </Typography>
      </FlexBetween>))};
      {/* <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography> */}
      
    </WidgetWrapper>
  );
};

export default AdvertWidget;
