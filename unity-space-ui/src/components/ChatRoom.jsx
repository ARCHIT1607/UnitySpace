// import {
//     collection,
//   } from "firebase/firestore";
// import React from 'react'
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { db } from "./firebase";

// function ChatRoom() {
//     function ChatRoom({ roomId, userId }) {
//         const [messages, setMessages] = useState([]);
//         const [text, setText] = useState('');
//         useEffect(() => {
//           const messagesRef = db.collection(`chatRooms/${roomId}/messages`);
//           const unsubscribe = messagesRef.orderBy('createdAt').onSnapshot(snapshot => {
//             const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setMessages(messages);
//           });
//           return unsubscribe;
//         }, [roomId]);
      
//         const sendMessage = async e => {
         
//         };
      
//         return (
//           <div>
//             {messages.map(message => (
//               <div key={message.id}>
//                 <img src={message.photoURL} alt={message.uid} />
//                 <p>{message.text}</p>
//               </div>
//             ))}
//             <form onSubmit={sendMessage}>
//               <input value={text} onChange={e => setText(e.target.value)} />
//               <button type="submit">Send</button>
//             </form>
//           </div>
//         );
//       }
// }

// export default ChatRoom