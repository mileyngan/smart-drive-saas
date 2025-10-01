import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import chatbotService from '../../services/chatbot.service';
import Button from './Button';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm your LukDrive assistant. Ask me anything about the Cameroonian road code." }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const mutation = useMutation({
        mutationFn: chatbotService.askChatbot,
        onSuccess: (response) => {
            setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'AI assistant is currently unavailable.');
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again in a moment." }]);
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        mutation.mutate(input);
        setInput('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
                aria-label="Open Chatbot"
            >
                <MessageSquare size={28} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50">
            <header className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                <div className="flex items-center">
                    <Bot className="mr-2"/>
                    <h3 className="font-bold">LukDrive Assistant</h3>
                </div>
                <button onClick={() => setIsOpen(false)} aria-label="Close Chatbot">
                    <X size={20} />
                </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'ai' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {mutation.isPending && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">Typing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-2 border-t">
                <form onSubmit={handleSend} className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 p-2 border rounded-full"
                        disabled={mutation.isPending}
                    />
                    <Button type="submit" className="ml-2 rounded-full p-2" disabled={mutation.isPending}>
                        <Send size={20}/>
                    </Button>
                </form>
            </footer>
        </div>
    );
};

export default Chatbot;