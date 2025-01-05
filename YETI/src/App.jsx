import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
const Spinner = () => (
  <div className='flex items-center space-x-2'>
    <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800'></div>
    <span className='italic'>typing...</span>
  </div>
)

const App = () => {
  const initialMessage = [
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ]

  const [messages, setMessages] = useState(initialMessage)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async() => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: input },
      ])
      setInput('')
      setIsLoading(true)
      var text = "";
      const url = import.meta.env.VITE_BACKEND_URL;
      try{
        const output = await axios.post(`${url}/askbot`, {input}, {
          headers : {
            'Content-Type': 'application/json',
            'authtoken': import.meta.env.VITE_AUTH_TOKEN,
            'langflowid': import.meta.env.VITE_LANGFLOW_ID,
            'flowid': import.meta.env.VITE_FLOW_ID
          }
        });
        if(output.status === 200){
          const response = output.data;
          const responseMessage = response.outputs[0].outputs[0].messages[0].message;
          text = responseMessage;
        }
        else if(output.status === 500){
          text = "There has been an error in server.!";
        }
        console.log(output)
      }
      catch (error) {
        console.log(error);
        text = "Sorry, I am unable to process your request at the moment. Please try again later.";
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text },
      ])
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessages(initialMessage) 
    setInput('') 
  }

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <header className='bg-blue-600 text-white flex items-center justify-between px-4 py-4 shadow-lg'>
        <div className='flex items-center space-x-3'>
          <div className='bg-white text-blue-600 font-bold text-2xl px-3 py-1 rounded-full shadow-md'>
            🐾
          </div>
          <span className='text-2xl font-semibold'>Yeti</span>
        </div>
        <div className='text-lg italic'>Social Media Engagement Analyzer</div>
      </header>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((msg, index) => (
          <div
          key={index}
          className={`flex ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}>
          <div
            className={`${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-black'
            } rounded-lg p-3 w-auto max-w-3xl shadow`}>
            {msg.text}
          </div>
        </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-gray-300 text-black rounded-lg p-3 max-w-xs'>
              <Spinner />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className='bg-white p-4 border-t border-gray-300'>
        <div className='flex items-center space-x-4'>
          <input
            type='text'
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300'
          />
          <button
            onClick={handleSend}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
            disabled={isLoading}
          >
            Send
          </button>
          <button
            onClick={handleClear}
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700'>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
