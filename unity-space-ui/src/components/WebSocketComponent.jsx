import React, { useState, useEffect, useRef } from 'react';
import SockJsClient from 'react-stomp';

const WebSocketComponent = () => {
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const socket = useRef(null);

   useEffect(() => {
       socket.current = new WebSocket('ws://localhost:8082');
       console.log("socket ",socket)
       socket.current.onmessage = (msg) => {
           const incomingMessage = `Message from WebSocket: ${msg.data}`;
           setMessages(messages.concat([incomingMessage]));
       };
       return () => {
           socket.current.close();
       };
   }, []);

   const onMessageChange = (e) => {
       setNewMessage(e.target.value);
   };

   const onMessageSubmit = () => {
       socket.current.send(newMessage);
   };

   return (
       <div>
           <SockJsClient url='http://localhost:8080/websocket' topics={['/topic/greetings']}
                         onMessage={(msg, topic) => {
                             const incomingMessage = `Message from ${topic}: ${msg.content}`;
                             setMessages(messages.concat([incomingMessage]));
                         }} debug={false} />
           <ul>
               {messages.map((msg, index) => {
                   return (<li key={index}>{msg}</li>)
               })}
           </ul>
           <input type='text' value={newMessage} onChange={onMessageChange} />
           <button onClick={onMessageSubmit}>Send</button>
       </div>
   );
};

export default WebSocketComponent;