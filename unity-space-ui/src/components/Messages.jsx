import { Box, Divider, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
function Messages({ message }) {
    const { palette } = useTheme();
    const main = palette.neutral.main;
    console.log("in messages component ",message)
    const { sid } = useSelector((state) => state.user);
  return (
    
    <Box sx={{height:"70vh"}}>
      {message && message.map((m) => (
            <Box >
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem", textAlign:sid===m.senderId? "right":"left"}} 
             >
                {m.senderText}
              </Typography>
            </Box>
          ))}
          
      </Box>
  )
}

export default Messages
