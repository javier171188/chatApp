import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "";

function ChatView() {
    const [response, setResponse] = useState("");

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT,{
            withCredentials: true,
          });
        socket.on("FromAPI", data => {
            setResponse(data);
        });
    }, []);

    return (
        <p>
        It is <time dateTime={response}> {response} </time>
        </p>
    );
};

export default ChatView;