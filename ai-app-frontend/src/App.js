import React, { useState, useEffect } from 'react';
import './App.css';
import goatIcon from './goat.png'; // Ensure this path is correct and the image exists

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('Thinking');

  useEffect(() => {
    let interval;
    if (isThinking) {
      interval = setInterval(() => {
        setThinkingText((prev) => {
          if (prev === 'Thinking...') return 'Thinking';
          return prev + '.';
        });
      }, 500);
    } else {
      setThinkingText('Thinking');
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { type: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      const cleanedPrediction = data.prediction.replace(/<think>|<\/think>/g, ''); // Remove <think> tags
      const aiMessage = { type: 'ai', content: cleanedPrediction };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={goatIcon} alt="Goat AI Logo" className="goat-icon" />
        <h1>Goat AI</h1>
        <div className="chat-container">
          <div className="chat-box">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${message.type === 'user' ? 'user-bubble' : 'ai-bubble'}`}
                >
                  {message.content}
                </div>
              ))}
              {isThinking && (
                <div className="chat-bubble ai-bubble">
                  {thinkingText}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your question..."
                  className="chat-input"
                />
                <button type="submit" className="chat-button">Send</button>
              </div>
            </form>
          </div>
        </div>
      </header>
      <footer className="App-footer">
        <p className="powered-by">Powered by:</p>
        <div className="tech-icons">
          <div className="tech-icon python-icon">
            <div className="tech-name">Python</div>
          </div>
          <div className="tech-icon react-icon">
            <div className="tech-name">React</div>
          </div>
          <div className="tech-icon deepseek-icon">
            <div className="tech-name">DeepSeek</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
