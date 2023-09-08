import { Box, IconButton, Typography, useMediaQuery, useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  TextField,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,  } from "@mui/material";
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
  updateDoc,
  where,
} from "firebase/firestore";

import { setCurrentChat, setCurrentGroupChat, setMessages } from "state";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";




const Group = ({ id, name, members, groupImage, size = "40px",friends }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sid } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(name);
  const [groupPicture, setGroupPicture] = useState(groupImage);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setGroupName(name);
    setPersonName(members);
    setOpen(false);
  };

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

  const getGroupMsg = async () => {
    console.log("id in Group", id);

  const q = query(collection(db, "roomChats"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs.map((doc) => doc.data());
    console.log("setChatDocuments in Group", document, document.length);
    dispatch(setMessages({ messages: [document[0]] }));
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

  const handleDelete = async () => {
    await deleteDoc(doc(db, "roomChats", id));
    window.location.reload(false);
  };

  const [personName, setPersonName] = useState(members);

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
  const updateGroup = async () => {
      const docRef = doc(db, 'roomChats', id);
      let downloadURL = null;
      const storage = getStorage();
      if(groupPicture){
        const storageRef = ref(storage, `groupPictures/${id}`);
      await uploadBytes(storageRef, groupPicture);
      downloadURL = await getDownloadURL(storageRef);
      }
      console.log("Download URL:", downloadURL);
      await updateDoc(docRef, {
        groupName: groupName,
        members : personName,
        picture : downloadURL===null?groupImage:downloadURL
      });

      setOpen(false);
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
        {isNonMobileScreens?<Typography
          color={main}
          variant="p"
          fontWeight="500"
          justifyContent="flex-start"
        >
          Members:{members.length}
        </Typography>:""}
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Group"}
        </DialogTitle>
        <DialogContent>
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
              label="Group Name"
              variant="standard"
              sx={{ width: "80%" }}
              value={groupName}
              onChange={handleGroupNameChange}
              required
            />
            <Box m={"2rem"}></Box>
            <input type="file" onChange={handleGroupPictureChange} />
            <Box m={"2rem"}></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateGroup}>Update Post</Button>
        </DialogActions>
      </Dialog>
      <IconButton>
      <EditIcon onClick={handleClickOpen}/>
      </IconButton> 
        <IconButton onClick={handleDelete} sx={{ p: "0.2rem",bgcolor:"grey" }}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
    </FlexBetween>
  );
};

export default Group;
