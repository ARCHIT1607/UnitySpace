import { Avatar, Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { setMessages } from "state";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import WidgetWrapper from "./WidgetWrapper";
import { makeStyles } from "@material-ui/core";

function Messages({ message }) {
  const [data, setData] = useState([{ id: "" }]);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const { sid } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [chatDocuments, setChatDocuments] = useState([]);
  let messages = useSelector((state) => state.messages);
  messages = messages !== null && messages.length != 0 ? messages : data;
  const primaryLight = palette.primary.light;
  
  const getChats = async () => {
    console.log("messages[0].id", messages[0].id);
    const q = query(
      collection(db, "chats"),
      where("id", "in", [messages[0].id])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setChatDocuments(documents);
    console.log("setChatDocuments in messages", documents);
    if (!chatDocuments) {
      // console.log("inside  chatDocuments false");
      const chatRef = doc(db, "chats", messages[0].id);
      await setDoc(chatRef, {
        id: messages[0].id,
        messages: [],
      });
    } else {
      // console.log("inside  chatDocuments true", documents);
      dispatch(setMessages({ messages: documents }));
    }
  };

  useEffect(() => {
    // getChats();
  }, []);

  return (
    <WidgetWrapper>
      <Box sx={{ height: "40vh", overflow: "auto" }}>
        {message &&
          message.map((m) => (
            <Box>
              <Typography>
                <ListItem
                  sx={{
                    color: main,
                    m: "0.5rem 0",
                    pl: "1rem",
                    textAlign: sid === m.senderId ? "right" : "left",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h2"
                        style={{
                          fontSize: "20px",
                          color: sid === m.senderId ? "blue" : "",
                        }}
                      >
                        {sid === m.senderId?<IconButton
                          sx={{ backgroundColor: primaryLight, p: "0.6rem",fontSize:"1rem",color:"grey",textAlign:"right" }}
                        >
                          {m.senderId}
                        </IconButton>:""}
                        {m.senderText}
                        {sid !== m.senderId?<IconButton
                          sx={{ backgroundColor: primaryLight, p: "0.6rem",fontSize:"1rem",color:"grey",textAlign:"right" }}
                        >
                          {m.senderId}
                        </IconButton>:""}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="h2" style={{ fontSize: "12px" }}>
                        {m.createdDate.toString()}
                      </Typography>
                    }
                  />
                </ListItem>
              </Typography>
            </Box>
          ))}
      </Box>
    </WidgetWrapper>
  );
}

export default Messages;
