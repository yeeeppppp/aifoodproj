import React from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export default function InputBar({ value, setValue, onSend, isLoading }) {
  return (
    <div className="input-container">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={isLoading}
        placeholder="Введите текст..."
        className="chat-input ui-input"
        aria-label="Поле ввода сообщения"
      />
      <Button onClick={onSend} disabled={isLoading || !value.trim()} className="send-button" variant="primary" size="md" aria-label="Отправить сообщение">
        Отправить
      </Button>
    </div>
  );
}


