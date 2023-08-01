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
import { setCurrentChat, setCurrentGroupChat, setMessages } from "state";

const ChatUser = ({ friendId, name, subtitle, userPicturePath, onlineStatus }) => {
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
    console.log("setChatDocuments in chatUser", documents,documents.length);
   
    if(documents.length==0){
       // if there is no document created for user and his friend
      const chatRef = doc(db, "chats", id);
      await setDoc(chatRef, {
        id:id,
        messages: [],
      });
    }else {
        dispatch(setMessages({ messages: documents }));
  }
}

  const createUserChatId = async () => {
    let currentFriend = {"friendId":friendId,"name":name,"profilePic":userPicturePath,"course":subtitle}
    dispatch(setCurrentChat({ currentChat: currentFriend }));
    getChats()
    dispatch(setCurrentGroupChat({ currentGroupChat: [] }));
    
  };



  useEffect(() => {
    getChats()
    console.log("id in groupChat ",id)
    const documentRef = doc(db, "roomChats", id);
          const unsubscribe = onSnapshot(documentRef, (doc) => {
            console.log("something got changed");
            getChats();
          });
          return () => unsubscribe();
  }, [])
  

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
        <Typography
          color={main}
          variant="h5"
          fontWeight="500"
          justifyContent="flex-start"
        >
          {onlineStatus===true?"online":"offline"}
        </Typography>
      </Box>
    </FlexBetween>
  );
};

export default ChatUser;
