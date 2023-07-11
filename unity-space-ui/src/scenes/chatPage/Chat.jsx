import { IconButton, useTheme } from "@mui/material";
import ChatMessages from "components/Messages";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { Send } from "@mui/icons-material";
import { Timestamp, arrayUnion, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "components/firebase";
import { setMessages } from "state";

function Chat() {
  const [data, setData] = useState([
    { id: ''},
  ]);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  let messages = useSelector((state) => state.messages);
  messages = messages.length!=0?messages:data;
  const { sid,fname } = useSelector((state) => state.user);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();
  const [chatDocuments, setChatDocuments] = useState([]);

  const getChats = async ()=>{
    console.log("messages[0].id",messages[0].id)
    const q = query(
      collection(db, "chats"),
      where("id", "in", [messages[0].id])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setChatDocuments(documents);
    console.log("setChatDocuments in chatUser", documents);
    if(!chatDocuments){
      console.log("inside  chatDocuments false");
      const chatRef = doc(db, "chats", messages[0].id);
      await setDoc(chatRef, {
        id:messages[0].id,
        messages: [],
      });
    }else {
        console.log("inside  chatDocuments true", documents);
        dispatch(setMessages({ messages: documents }));
  }
  }


  const sendMessage = async () => {
    console.log("messages[0].id ",messages[0].id)
    const documentRef = doc(db, "chats", messages[0].id);
    console.log("inputMessage ",inputMessage)
    await updateDoc(documentRef, {
      messages: arrayUnion({
        senderText: inputMessage,
        senderId: sid,
        senderName:fname,
      }),
    });
    console.log("Message added to the array successfully!");
    setInputMessage("")
    getChats();
  };

  useEffect(() => {
    if(messages[0].id){
      const documentRef = doc(db, 'chats', messages[0].id);
    const unsubscribe = onSnapshot(documentRef, (doc) => {
      console.log("something got added")
      getChats()
    });
    return () => unsubscribe();
    }
  }, [messages[0].id]);
  

  return (
    <WidgetWrapper>
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
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={sendMessage}>
          <Send />
        </IconButton>
      </Paper>
    </WidgetWrapper>
  );
}

export default Chat;
