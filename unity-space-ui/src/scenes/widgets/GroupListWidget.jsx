import { Box, TextField, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChat,
  setCurrentGroupChat,
  setFriends,
  setMessages,
} from "state";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "components/firebase";
import Group from "components/Group";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import DetectImageExplicitContent from "components/DetectImageExplicitContent";
import { toast } from "react-toastify";

const GroupListWidget = ({ userId, userPicturePath }) => {
  const [data, setData] = useState([{ id: "" }]);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  // let currentGroupChat = useSelector((state) => state.currentGroupChat);
  // let currentGroup = useSelector((state) => state.currentGroupChat.currentGroupChat);
  const [currentGroup, setCurrentGroup] = useState([]);
  const friends = useSelector((state) => state.user.friends);
  const { sid } = useSelector((state) => state.user);
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupName, setGroupName] = useState("");
  const [groupPicture, setGroupPicture] = useState(null);
 const [isHate, setIsHate] = useState(false)
 const [errorMsg, setErrorMsg] = useState("")
 
 
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "20rem",
    transform: "translate(-50%, -50%)",
    width: "20rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const getGroupMsg = async () => {
    console.log("sid in GroupListWidget", sid);
    const q = query(
      collection(db, "roomChats"),
      where("members", "array-contains", sid)
    );
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs.map((doc) => doc.data());
    console.log(
      "setChatDocuments in groupListWidget",
      document,
      document.length,
      sid
    );
    setDocuments(document);
    dispatch(
      setMessages({ messages: document.length !== 0 ? [document[0]] : data })
    );
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
  };

  useEffect(() => {
    getGroupMsg();
    const q = query(
      collection(db, "roomChats"),
      where("members", "array-contains", sid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(
        "calling unsubscribe in groupListWidget after change in groupList"
      );
      const document = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(document);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const [personName, setPersonName] = useState([sid]);

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
    const response = await handleImageUpload(groupPicture);
    console.log("response in groupListWidget ",response)
    if(response!==undefined &&response===true){
      console.log("isHate ", isHate);
    if (isHate===false) {
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
      setPersonName(typeof sid === "string" ? userId.split(",") : sid);
      console.log("setPersonName ", personName);
      // Set the data for the new document
      await setDoc(chatRef, {
        id: chatRef.id,
        groupName: groupName,
        members: personName,
        createdBy: userId,
        picture: downloadURL,
        messages: [],
      });

      // Reset the form
      setGroupName("");
      setPersonName([sid]);
      setGroupPicture(null);
      handleClose(false);
      getGroupMsg();
      toast("Group created successfully")
    } else {
      window.alert(
        "inappropriate content detected. Please refrain from spreading negativity"
      );
      setGroupPicture(null);
      handleClose(false);
    }
    }else{
      window.alert(
        "Please use an image"
      );
      setGroupPicture(null);
      handleClose(false);
    }

  };

  const handleImageUpload = async (image) => {
    console.log("image in  handleImageUpload of groupChatListWidget ", image);
    try{
      if(image['type'].startsWith("image/")){
        const result = await DetectImageExplicitContent(image);
      console.log("eden api result ", result, result[0].nsfw_likelihood >= 5);
      setIsHate(result[0].nsfw_likelihood >= 5)
      return true; 
      }else{
        console.log("inside error");
        throw new Error('Please pass an image');
      }
    }catch(error){
      console.log("inside catch");
      setErrorMsg(error)
      return false;
    }
  }

  return (
    <WidgetWrapper sx={{ textAlign: "center", justifyItems: "center" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign: "center" }}
      >
        Group Chats
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Create Group
      </Button>
      <Box m="2rem 0" />
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
            <Box m={"2rem"}></Box>
            <input type="file" onChange={handleGroupPictureChange} required />
            <Box m={"2rem"}></Box>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </form>
        </Box>
      </Modal>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {documents &&
          documents.map((group) => (
            <Group
              id={group.id}
              name={group.groupName}
              members={group.members}
              groupImage={group.picture}
              size="55px"
              friends={friends}
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default GroupListWidget;
