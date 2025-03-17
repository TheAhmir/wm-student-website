import React from 'react';
import MessageComponent from './utils/MessageComponent'; 
import './MessageView.scss';

const MessageView = () => {
  return (
    <div className='message-page'>
      <div className='contacts'>
      Hi
      </div>
      <div className='messages'>
        <MessageComponent />
      </div>
    </div>
  )
}

export default MessageView
