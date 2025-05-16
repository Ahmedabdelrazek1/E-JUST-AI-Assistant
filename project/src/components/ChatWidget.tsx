import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm E-JUST's virtual assistant. How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputText })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const botReply = data?.answer?.trim() || "Sorry, I couldn't find an answer.";
      setMessages(prev => [...prev, { text: botReply, isUser: false }]);
    } catch (error) {
      console.error('ChatWidget error:', error);
      setMessages(prev => [
        ...prev,
        {
          text: 'Sorry, something went wrong. Please try again later.',
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[500px]">
          <div className="bg-red-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">E-JUST Assistant</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3 max-h-80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[85%] ${
                  msg.isUser ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="self-start bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-3 flex">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700 transition-colors z-50 flex items-center justify-center"
        aria-label="Chat with E-JUST Assistant"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default ChatWidget;
