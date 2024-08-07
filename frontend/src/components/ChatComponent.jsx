import axios from 'axios';
import React, { useState } from 'react';

const ChatComponent = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'hello', user: true },
    { text: 'This is a response from the chatbot.', user: false },

  ]);

  

  const chatBot=(data)=>{
    // setMessages([...messages,{text:data,user:true}]);
    axios.post("http://localhost:5000/api/getAnswerBot",{"question":data}).then((data)=>{
        console.log(data.data);
        // setMessages([...messages,{text:data.data,user:false}])
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.data, user: false }
          ]);
    }).catch((err)=>{
        console.log(err);
    })
}
  const [userInput, setUserInput] = useState('');

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  const addUserMessage = (message) => {
    setMessages([...messages, { text: message, user: true }]);
    // respondToUser(message);
  };

  const respondToUser = (message) => {
    // Replace this with your chatbot logic
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'This is a response from the chatbot.', user: false }
      ]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      addUserMessage(userInput);
      chatBot(userInput);
      setUserInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="fixed bottom-0 right-0 mb-4 mr-4 chatBot">
        <button
          id="open-chat"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
          onClick={toggleChatbox}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Chat with Bot
        </button>
      </div>
      {isChatboxOpen && (
        <div id="chat-container" className="fixed bottom-16 right-4 w-96">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
              <p className="text-lg font-semibold">Admin Bot</p>
              <button
                id="close-chat"
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
                onClick={toggleChatbox}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div id="chatbox" className="p-4 h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.user ? 'text-right' : ''}`}>
                  <p className={`rounded-lg py-2 px-4 inline-block ${message.user ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                id="user-input"
                type="text"
                placeholder="Type a message"
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                id="send-button"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
