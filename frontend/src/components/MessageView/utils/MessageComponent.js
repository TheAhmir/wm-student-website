import React from 'react';
import './MessageComponent.scss';
        
const MessageComponent = () => {

  return (
    <div className='message-component-page'>
      <div>
        Messages go here
      </div>
      <form className='message-input-container'>
        <div className='message-input'>
          <input className='searchbox'></input>
          <i className="pi pi-send" style={{ fontSize: '1.5rem' }}></i>
       </div>
      </form>
    </div>
  )
}

export default MessageComponent;
