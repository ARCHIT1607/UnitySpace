import { Box, Divider, Typography, useTheme } from "@mui/material";
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

function Messages({ message }) {
  const [data, setData] = useState([{ id: "" }]);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const { sid } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [chatDocuments, setChatDocuments] = useState([]);
  let messages = useSelector((state) => state.messages);
  messages = messages.length != 0 ? messages : data;
  const getChats = async () => {
    console.log("messages[0].id", messages[0].id);
    const q = query(
      collection(db, "chats"),
      where("id", "in", [messages[0].id])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setChatDocuments(documents);
    console.log("setChatDocuments in chatUser", documents);
    if (!chatDocuments) {
      console.log("inside  chatDocuments false");
      const chatRef = doc(db, "chats", messages[0].id);
      await setDoc(chatRef, {
        id: messages[0].id,
        messages: [],
      });
    } else {
      console.log("inside  chatDocuments true", documents);
      dispatch(setMessages({ messages: documents }));
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <Box sx={{ height: "70vh", overflow: "auto" }}>
      {message &&
        message.map((m) => (
          <Box>
            <Typography
              sx={{
                color: main,
                m: "0.5rem 0",
                pl: "1rem",
                textAlign: sid === m.senderId ? "right" : "left",
              }}
            >
              {m.senderText}
            </Typography>
          </Box>
        ))}
    </Box>
  );
}

export default Messages;
