import { Box, TextField, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat, setCurrentGroupChat, setFriends, setMessages } from "state";
import Axios from "axios";
import ChatUser from "components/ChatUser";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "components/firebase";
import Group from "components/Group";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4 as uuidv4} from 'uuid';

const GroupListWidget = ({ userId, userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupName, setGroupName] = useState("");
  const [groupPicture, setGroupPicture] = useState(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "30rem",
    transform: "translate(-50%, -50%)",
    width: "20rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
    console.log("setChatDocuments in groupListWidget", document,document.length,sid);
    setDocuments(document);
    dispatch(setMessages({ messages: document}));
  let currentGroupChat = {"id":document[0].id,"name":document[0].groupName,"profilePic":document[0].picture,"member":document[0].members.length}
    dispatch(setCurrentGroupChat({ currentGroupChat: currentGroupChat }));
    dispatch(setCurrentChat({ currentChat: [] }));
    // getGroupMsg()
  }

  useEffect(() => {
    console.log("calling getGroupMsg");
    getGroupMsg();
    console.log("getGroupMsg from useffect groupListWidget", documents);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [personName, setPersonName] = useState([userId]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleGroupPictureChange = (event) => {
    setGroupPicture(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the current user's ID
    const userId = sid;

    // Create a reference to the new group collection
    const groupRef = collection(db, "roomChats");

    // Create a new document with an auto-generated ID
    const docRef = doc(groupRef);
    const chatRef = doc(db, "roomChats", uuidv4());

    // Upload the group picture to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, `groupPictures/${chatRef.id}`);
    await uploadBytes(storageRef, groupPicture);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL:", downloadURL);
    setPersonName(
      typeof userId === "string" ? userId.split(",") : userId
    );
 console.log("setPersonName ",personName)
    // Set the data for the new document
    await setDoc(chatRef, {
      id:chatRef.id,
      groupName: groupName,
      members: personName,
      createdBy: userId,
      picture: downloadURL,
      messages: [],
    });

    // Reset the form
    setGroupName("");
    setPersonName([]);
    setGroupPicture(null);
    handleClose(false);
  };

  // const createGroupChat = async () => {
  //   const q = query(collection(db, "roomChats"));
  //   const querySnapshot = await getDocs(q);
  //   const documents = querySnapshot.docs.map((doc) => doc.data());
  //   setDocuments(documents);

  //   console.log("group chat id checking done ", documents);
  //   if (documents.length == 0) {
  //     const newCollectionRef = collection(db, "roomChats");
  //     const docRef = doc(newCollectionRef);
  //     await setDoc(docRef, {
  //       members: personName,
  //       createdBy: sid,
  //       groupPicture: "",
  //       messages: [],
  //     });
  //     console.log(
  //       "roomChats collection with its corresponding chat reference created "
  //     );
  //   }
  // };

  return (
    <WidgetWrapper  sx={{textAlign:"center",justifyItems:"center"}}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign: "center" }}
      >
        Group Chats
      </Typography>
      <Button variant="contained" onClick={handleOpen}>Open modal</Button>
      <Box m="2rem 0"  />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <InputLabel id="demo-multiple-checkbox-label">Members</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Members" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ width: "80%" }}
              required
            >
              {friends.map((friend) => (
                <MenuItem key={friend.sid} value={friend.sid}>
                  <Checkbox checked={personName.indexOf(friend.sid) > -1} />
                  <ListItemText primary={friend.fname} />
                </MenuItem>
              ))}
            </Select>
            <TextField
              id="standard-basic"
              label="groupName"
              variant="standard"
              sx={{ width: "80%" }}
              value={groupName}
              onChange={handleGroupNameChange}
              required
            />
            <input type="file" onChange={handleGroupPictureChange} required />
            <Button type="submit" variant="contained">
              Create
            </Button>
          </form>
        </Box>
      </Modal>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {documents &&
          documents.map((group) => (
            <Group name={group.groupName} members={group.members} groupImage={group.picture} size="55px"/>
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default GroupListWidget;
