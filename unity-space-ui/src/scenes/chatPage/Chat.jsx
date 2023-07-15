import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import ChatMessages from "components/Messages";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { Send } from "@mui/icons-material";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "components/firebase";
import { setMessages } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

function Chat({ pictureName,name, course, friendId }) {
  const [data, setData] = useState([{ id: "" }]);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  let messages = useSelector((state) => state.messages);
  messages = messages !== null && messages.length != 0 ? messages : data;
  const { sid, fname } = useSelector((state) => state.user);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();
  const [chatDocuments, setChatDocuments] = useState([]);

  const getChats = async () => {
    console.log("messages[0].id", messages[0].id);
    const q = query(
      collection(db, "chats"),
      where("id", "in", [messages[0].id])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setChatDocuments(documents);
    // console.log("setChatDocuments in chatUser", documents);
    if (!chatDocuments) {
      console.log("inside  chatDocuments false");
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

  const sendMessage = async () => {
    console.log("messages[0].id ", messages[0].id);
    const documentRef = doc(db, "chats", messages[0].id);
    console.log("inputMessage ", inputMessage);
    await updateDoc(documentRef, {
      messages: arrayUnion({
        senderText: inputMessage,
        senderId: sid,
        senderName: fname,
        createdDate: new Date().toLocaleDateString(),
        profilePic: pictureName,
      }),
    });
    console.log("Message added to the array successfully!");
    setInputMessage("");
    getChats();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Submit the form
      sendMessage();
    }
  };

  // useEffect(() => {
  //   if (messages[0].id) {
  //     const documentRef = doc(db, "chats", messages[0].id);
  //     const unsubscribe = onSnapshot(documentRef, (doc) => {
  //       console.log("something got added");
  //       getChats();
  //     });
  //     return () => unsubscribe();
  //   }
  // }, [messages[0].id]);

  const navigate = useNavigate();
  const medium = palette.neutral.medium;
  return (
    <WidgetWrapper>
      <FlexBetween gap={"1rem"} style={{justifyContent:"flex-start"}}>
        <UserImage image={pictureName} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h4"
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
          <Typography color={medium} fontSize="0.9rem">
          {course}
          </Typography>
        </Box>
      </FlexBetween>
      <Divider sx={{ margin: "1.25rem 0",height:"5px",bgcolor:"black" }} />
      {messages &&
        messages.map((message) => (
          <ChatMessages message={message.messages}></ChatMessages>
        ))}

      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={sendMessage}
        >
          <Send />
        </IconButton>
      </Paper>
    </WidgetWrapper>
  );
}

export default Chat;
