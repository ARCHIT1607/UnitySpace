import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItemText,
  RadioGroup,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Divider, Paper, Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import Axios from "axios";
import { useNavigate } from "react-router";
import { setLogout } from "state";
import SentimentAnalysis from "components/SentimentAnalysis";

function Dashboard() {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { sid } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.user.friends);
  const posts = useSelector((state) => state.posts);
  const jwtToken = useSelector((state) => state.token.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const date = new Date();
  const today = date.toISOString().slice(0, 10);
  const [data, setData] = useState("")
  const [eventName, setEventName] = useState("")
  console.log("data ",data)
  const [selectedDate, setSelectedDate] = useState(null);
  console.log("date ", today);
  const [event, setEvent] = useState();

  const [selectedValue, setSelectedValue] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

 const handleSnackbarClick = () => {
  setOpenSnackbar(true);
 };

 const handleSnackbarClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }

   setOpenSnackbar(false);
 };
 


  const handleDateChange = (date) => {
    setSelectedDate(date.target.value);
  };

  const handleSubmitEvent = async () => {
    console.log("calling handleSubmitEvent");
    console.log("handleSubmitEvent ",eventName,selectedDate)

    try{
        const response = await Axios.post("http://localhost:9000/dashboard/createEvent",null, {
            params: {
              eventName: eventName,
              eventDate:selectedDate
            },
            headers: {
              Authorization: "Bearer " + jwtToken,
            },
    });
    console.log("getDashboard data ", response.data);
    setData(response.data)
    setEvent(response.data)
    handleSnackbarClick()
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };

  const getDashboardData = async () => {
    console.log("calling patchFriend");
    try{const response = await Axios.get("http://localhost:9000/dashboard/getDashboardData", {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    });
    console.log("getDashboard data ", response.data);
    setData(response.data)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  };

  const getEvents = async () => {
    try {
      const response = await Axios.get(`http://localhost:9000/events`, {
        headers: { Authorization: "Bearer " + jwtToken },
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

  const deleteEvent = async (id) => {
    console.log("calling deleteEvent ",id);
    try{const response = await Axios.post("http://localhost:9000/dashboard/deleteEvent",null, {
      params: {
        eventId: id,
      },
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    });
    console.log("deleteEvent data ", response);
    setEvent(response.data)
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  }

  const getAllComments = async () => {
    console.log("calling getAllComments ");
    try{const response = await Axios.get("http://localhost:9000/dashboard/getAllComments", {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    });
    console.log("getAllComments data ", response);
    return response.data
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  }

  const getAllPostDescription = async () => {
    console.log("calling getAllPostDescription ");
    try{const response = await Axios.get("http://localhost:9000/dashboard/getAllPostDescription", {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    });
    console.log("getAllPostDescription data ", response);
    return response.data
  } catch (error) {
    console.error("Error fetching data: ", error);
    if(error.code=="ERR_NETWORK"){
      // window.alert("Session Expired Please login again")
      dispatch(setLogout());
      navigate("/");
    }
  }
  }

  const handleRadioChange = async (event) => {
    console.log("setSelectedValue ", event.target.value);
    setSelectedValue(event.target.value)
    let input = "";
    if(event.target.value ==="Comments")
    {
      input = await getAllComments();
    }else if(event.target.value ==="post_description")
    {
      input = await getAllPostDescription();
    }
    let result = await handleAnalysis(input)
    setAnalysis(result);
  };

  useEffect(() => {
    getDashboardData()
    getEvents()
  }, [])
  
  const handleAnalysis = async (text) => {
    console.log("text passing to api ",text);
    const result = await SentimentAnalysis(text);
    console.log("eden api result ",result);
    return result[0].general_sentiment
  }


  return (
    <>
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="center"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 128,
                height: 128,
              },
            }}
          >
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
              elevation={3}
            >
              <ListItemText
                primary="Users"
                secondary={data!==null?data.users:""}
                sx={{ textAlign: "center" }}
              />
            </Paper>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
              elevation={3}
            >
              <ListItemText
                primary="Posts"
                secondary={data.posts}
                sx={{ textAlign: "center" }}
              />
            </Paper>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
              elevation={3}
            >
              <ListItemText
                primary="Online"
                secondary={data.online}
                sx={{ textAlign: "center" }}
              />
            </Paper>
          </Box>
        </Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Events</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ border: "1px solid black" }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 250,
                  height: 58,
                },
              }}
            >
              <TextField
                label="Event Name"
                name="eventName"
                value={eventName}
                onChange={(e)=>setEventName(e.target.value)}
                required
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                type="date"
                defaultValue={today}
                value={selectedDate}
                onChange={handleDateChange}
                inputProps={{ min: today, max: "2099-12-31" }}
              />
              <Button variant="contained" onClick={handleSubmitEvent}>
                Submit Event
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Sentimental Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 400,
                  height: 58,
                },
              }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  On basis of
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedValue}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="Comments"
                    control={<Radio />}
                    label="Comments"
                  />
                  <FormControlLabel
                    value="post_description"
                    control={<Radio />}
                    label="Post Description"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Typography variant="h4" component="h4">
                {analysis}
              </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>All Events</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100%",
                  overflow:"auto"
                },
              }}
            >
               <TableContainer component={Paper}>
      <Table sx={{ border:"1px solid black" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell align="right">Event Name</TableCell>
            <TableCell align="right">Event Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {event &&event.map((e) => (
            <TableRow
              key={e.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{e.id}</TableCell>
              <TableCell align="right">{e.eventName}</TableCell>
              <TableCell align="right">{e.eventDate}</TableCell>
              <TableCell align="right"><Button variant="contained" onClick={()=>{deleteEvent(e.id)}}>
                Delete
              </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Events Created"
      />
      </Box>
    </>
  );
}

export default Dashboard;