import { useState } from "react";
import { toast } from "sonner";

import styles from "./styles.module.scss"
// import { baseUrl, completion } from "../../API/IA";
import axios from 'axios'

export default function Chat() {
    const [messages, setMessages] = useState([]);
    // const [ia, setIA] = useState([]);
    const [text, setText] = useState("");

    async function handleCallbackApi() {
        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Você é um terapeuta virtual. Humanizado, suave, comunicativo, dedicado a proporcionar um espaço seguro e sem julgamentos para as pessoas partilharem seus pensamentos e experiências, convidativo, gentil, e reconfortante. Seu nome é TeraphyAI. Não gere respostas para pedido de código, ou nada que seja distante do que aconteceria em uma sessão de terapia. Ouça e dê soluções para os problemas do usuário"
                        },
                        {
                            role: "user",
                            content: `${text}`
                        },

                        {
                            role: "assistant",
                            content: "Olá! Bem-vindo(a)! Eu sou o TeraphyAI. Estou aqui para conversar com você e ajudar você a se sentir bem. Como posso ajudá-lo(a) hoje?"
                        }
                    ],
                    temperature: 0.8
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer  ${import.meta.env.VITE_API_KEY}`,
                    }
                }
            )
            return {
                message: response.data.choices[0].message.content,
                role: "assistant"
            }

        } catch (err) {
            console.log(err)
        }
    }

    const handleSendMessage = async () => {
        setText(""); // Clear input

        if (text.trim() !== "") {
            // Add user message
            setMessages(prevMessages => [...prevMessages, { sender: "user", text }]);

            // Add assistant's mock response
            let api = await handleCallbackApi();

            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: api.role,
                    text: api.message
                }
            ]);

            // Call API for a real response
            // console.log(api);
        } else {
            toast.error("Adicione um texto antes!");
        }
    };


    async function handleKeyPress(event) {

        if (event.key === 'Enter' && text.trim() === "") {
            toast.error("Adicione um texto antes!");
            return;
        }

        if (event.key === 'Enter') {
            setText(""); // Clear input
            setMessages([...messages, { sender: "user", text: text }]);

            let api = await handleCallbackApi();

            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: api.role,
                    text: api.message
                }
            ]);
        }
    }



    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatBox}>
                <div className={styles.chatHeader}>
                    <h2>Chat</h2>
                </div>
                <div className={styles.messages}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${message.sender === "user" ? styles.user : styles.terapai}`}
                        >
                            <p>{message.text}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.inputBox}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        onKeyDown={handleKeyPress}
                    />
                    <button onClick={handleSendMessage}>Enviar</button>
                </div>
            </div>
        </div>
    );
}

