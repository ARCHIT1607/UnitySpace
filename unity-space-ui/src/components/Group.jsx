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

const Group = ({name, members, groupImage, size = "60px" }) => {
  const { sid } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;


  const getGroupMsg = async ()=>{

    // const q = query(
    //   collection(db, "roomChats"),
    //   where("id", "in", [sid])
    // );
    // const querySnapshot = await getDocs(q);
    // const documents = querySnapshot.docs.map((doc) => doc.data());
    // // console.log("id reverseId",id, reverseId);
    // console.log("setChatDocuments in Group", documents,documents.length);
    
  console.log("sid in Group", sid);
  const q = query(collection(db, "roomChats"), where("members", "array-contains", sid));
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs.map((doc) => doc.data());
    console.log("setChatDocuments in Group", document,document.length,sid);
    dispatch(setMessages({ messages: document}));
  let currentGroupChat = {"id":document[0].id,"name":document[0].groupName,"profilePic":document[0].picture,"member":document[0].members.length}
    dispatch(setCurrentGroupChat({ currentGroupChat: currentGroupChat }));
    dispatch(setCurrentChat({ currentChat: [] }));
    // getGroupMsg()
  }

  

  return (
    <FlexBetween style={{justifyContent:"center"}} gap="1rem" onClick={getGroupMsg}>
      <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={groupImage}
      />
    </Box>
      <Box>
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
          Members:{members.length}
        </Typography>
      </Box>
    </FlexBetween>
  );
};

export default Group;
