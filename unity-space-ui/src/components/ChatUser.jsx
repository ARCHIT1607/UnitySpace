import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { setCurrentChat, setMessages } from "state";

const ChatUser = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { sid } = useSelector((state) => state.user);
  const main = palette.neutral.main;
  const [documents, setDocuments] = useState([]);
  const [chatDocuments, setChatDocuments] = useState([]);
  const [documentId, setDocumentId] = useState("");

  const id = sid + ":" + friendId;
  const reverseId = friendId + ":" + sid;
  const currentChat = useSelector((state) => state.currentChat);


  const getChats = async ()=>{

    const q = query(
      collection(db, "chats"),
      where("id", "in", [id, reverseId])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setChatDocuments(documents);
    console.log("id reverseId",id, reverseId);
    console.log("setChatDocuments in chatUser", documents,documents.length);
    if(documents.length==0){
      console.log("inside  chatDocuments false");
      const chatRef = doc(db, "chats", id);
      await setDoc(chatRef, {
        id:id,
        messages: [],
      });
    }else {
        console.log("inside  chatDocuments true");
        dispatch(setMessages({ messages: documents }));
  }
}

  const createUserChatId = async () => {
    const q = query(
      collection(db, "userChats"),
      where("id", "in", [id, reverseId])
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    setDocuments(documents);

    console.log("user chat id checking done ", documents);
    if(!documents){
      const userRef = doc(db, "userChats", id);
      await setDoc(userRef, {
        id: id,
        userId: sid,
        friendId: friendId,
        displayName: name,
      });
      console.log(
        "userChats collection with its corresponding chat reference created "
      );
  
    }
    let currentFriend = {"friendId":friendId,"name":name,"profilePic":userPicturePath,"course":subtitle}
    dispatch(setCurrentChat({ currentChat: currentFriend }));
    getChats()
    
  };

  useEffect(() => {
    getChats()
  }, [currentChat])
  

  return (
    <FlexBetween style={{justifyContent:"center"}} gap="1rem">
      <UserImage image={userPicturePath} size="55px" />
      <Box onClick={createUserChatId}>
        <Typography
          color={main}
          variant="h5"
          fontWeight="500"
          justifyContent="flex-start"
        >
          {name}
        </Typography>
      </Box>
    </FlexBetween>
  );
};

export default ChatUser;
