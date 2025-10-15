import React from 'react';

export default function MessagesList({ messages, isLoading, endRef }) {
  return (
    <div className="messages-container" role="log" aria-live="polite">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
          <div className="message-content">{msg.text}</div>
        </div>
      ))}
      {isLoading && (
        <div className="message ai-message">
          <div className="message-content">FOODAI печатает...</div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}


