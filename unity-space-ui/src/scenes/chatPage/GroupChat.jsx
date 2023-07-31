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
import { setCurrentChat, setCurrentGroupChat, setMessages } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";
import badWords from 'bad-words';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GroupChat({ pictureName,name, member, id, size = "60px" }) {
  const [data, setData] = useState([{ id: "" }]);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  let messages = useSelector((state) => state.messages);
  messages = messages !== null && messages.length != 0 ? messages : data;
  const { sid, fname } = useSelector((state) => state.user);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();
  const [chatDocuments, setChatDocuments] = useState([]);

  const getGroupMsg = async ()=>{

    
    console.log("id in Group", id);
    const q = query(collection(db, "roomChats"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const document = querySnapshot.docs.map((doc) => doc.data());
      console.log("setChatDocuments in Group", document,document.length);
      dispatch(setMessages({ messages: document}));
      let currentGroupChat = document.length!=0?{"id":document[0].id,"name":document[0].groupName,"profilePic":document[0].picture,
      "member":document[0].members.length}:[]
      dispatch(setCurrentGroupChat({ currentGroupChat: currentGroupChat }));
      dispatch(setCurrentChat({ currentChat: [] }));
      // getGroupMsg()
    }

  const handleTextChange = (event) => {
    const filter = new badWords();
    filter.removeWords("hell");
    const newText = event.target.value ? event.target.value : '';
    if(filter.isProfane(newText)){
      toast("Inappropriate Content detected");
      setInputMessage("")
    }else{
      setInputMessage(newText);
    }
  };

  const sendMessage = async () => {
    console.log("messages[0].id ", messages[0].id);
    const documentRef = doc(db, "roomChats", messages[0].id);
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
    getGroupMsg();
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
      <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={pictureName}
      />
    </Box>
        <Box
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
          {member}
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
          onChange={handleTextChange}
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

export default GroupChat;
