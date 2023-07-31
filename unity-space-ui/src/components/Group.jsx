import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { setCurrentChat, setCurrentGroupChat, setMessages } from "state";
import DeleteIcon from "@mui/icons-material/Delete";
const Group = ({ id, name, members, groupImage, size = "40px" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;

  const getGroupMsg = async () => {
    console.log("id in Group", id);
    const q = query(collection(db, "roomChats"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs.map((doc) => doc.data());
    console.log("setChatDocuments in Group", document, document.length);
    dispatch(setMessages({ messages: document }));
    let currentGroupChat =
      document.length != 0
        ? {
            id: document[0].id,
            name: document[0].groupName,
            profilePic: document[0].picture,
            member: document[0].members.length,
          }
        : [];
    dispatch(setCurrentGroupChat({ currentGroupChat: currentGroupChat }));
    dispatch(setCurrentChat({ currentChat: [] }));
    // getGroupMsg()
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "roomChats", id));
    getGroupMsg();
  };

  return (
    <FlexBetween
      style={{ justifyContent: "center" }}
      gap="1rem"
      onClick={getGroupMsg}
    >
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
          variant="h6"
          fontWeight="500"
          justifyContent="flex-start"
        >
          {name}
        </Typography>
        <Typography
          color={main}
          variant="p"
          fontWeight="500"
          justifyContent="flex-start"
        >
          Members:{members.length}
        </Typography>
        <IconButton onClick={handleDelete} sx={{ p: "0.6rem" }}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
    </FlexBetween>
  );
};

export default Group;