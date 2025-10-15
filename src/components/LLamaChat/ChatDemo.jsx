import React, { useState } from 'react';
import LLamaChatV3 from './LLamaChatV3';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './ChatDemo.css';

/**
 * Демонстрационный компонент для тестирования нового чата
 */
function ChatDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [demoMode, setDemoMode] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'

  const demoModes = [
    { key: 'mobile', label: '📱 Мобильная версия', description: 'Bottom sheet с FAB кнопками' },
    { key: 'tablet', label: '📱 Планшетная версия', description: 'Split view с боковыми панелями' },
    { key: 'desktop', label: '💻 Десктопная версия', description: 'Боковые панели с hover эффектами' }
  ];

  return (
    <div className="chat-demo">
      <Card className="chat-demo__controls">
        <h2>🚀 Демо нового LLamaChat</h2>
        <p>Протестируйте улучшенную версию чата с адаптивным дизайном</p>
        
        <div className="demo-modes">
          {demoModes.map(mode => (
            <button
              key={mode.key}
              className={`demo-mode-btn ${demoMode === mode.key ? 'active' : ''}`}
              onClick={() => setDemoMode(mode.key)}
            >
              <div className="demo-mode-btn__label">{mode.label}</div>
              <div className="demo-mode-btn__description">{mode.description}</div>
            </button>
          ))}
        </div>

        <div className="demo-actions">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? 'Скрыть демо' : 'Показать демо'}
          </Button>
        </div>

        <div className="demo-features">
          <h3>✨ Новые возможности:</h3>
          <ul>
            <li>🎯 Адаптивный дизайн для всех устройств</li>
            <li>📱 Мобильный bottom sheet с FAB кнопками</li>
            <li>🔄 Плавные анимации и переходы</li>
            <li>♿ Улучшенная доступность</li>
            <li>🎨 Современный Material Design</li>
            <li>⚡ Оптимизированная производительность</li>
            <li>🔧 Модульная архитектура с хуками</li>
            <li>📦 Переиспользуемые компоненты</li>
          </ul>
        </div>
      </Card>

      {showDemo && (
        <div className={`chat-demo__container chat-demo__container--${demoMode}`}>
          <div className="chat-demo__overlay" onClick={() => setShowDemo(false)} />
          <div className="chat-demo__content">
            <div className="chat-demo__header">
              <h3>Демо: {demoModes.find(m => m.key === demoMode)?.label}</h3>
              <button 
                className="chat-demo__close"
                onClick={() => setShowDemo(false)}
                aria-label="Закрыть демо"
              >
                ✕
              </button>
            </div>
            <div className="chat-demo__iframe">
              <LLamaChatV3 />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatDemo;
