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
                            content: "Você é um terapeuta virtual"
                        },
                        {
                            role: "user",
                            content: { text }
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer your_api_key",
                    }
                }
            )

            return response

        } catch (err) {
            console.log(err)
        }
    }

    const handleSendMessage = async () => {
        if (text.trim() !== "") {
            // Add user message
            setMessages(prevMessages => [...prevMessages, { sender: "user", text }]);
            
            // Add assistant's mock response
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: "assistant",
                    text: "Entendido, isso deve ser útil. Aqui está uma sugestão..."
                }
            ]);
    
            // Call API for a real response
            let api = await handleCallbackApi();
            console.log(api);
            
            setText(""); // Clear input
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
            setMessages([...messages, { sender: "user", text: text }]);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: "assistant",
                    text: "Entendido, isso deve ser útil. Aqui está uma sugestão..."
                }
            ]);
            let api = await handleCallbackApi()
            console.log(api)
            // console.log(completion(text))
            setText("");
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

