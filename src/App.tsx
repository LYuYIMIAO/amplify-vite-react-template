import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useState } from 'react';
import './App.css';

/**前端页面设置 */

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [messages, setMessages] = useState<Array<Schema["Message"]["type"]>>([]); // 聊天消息
  const [chatInput, setChatInput] = useState<string>(""); // 聊天输入框内容
  const { user, signOut } = useAuthenticator();

   // 订阅 todos 数据
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  // 订阅 messages 数据
  useEffect(() => {
    const subscription = client.models.Message.observe().subscribe({
      next: (message) => {
        setMessages((prev) => [...prev, message.value]);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  // 收到消息时自动滚到底部
  useEffect(() => {
    const chatContainer = document.querySelector("#chatContainer");
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  }, [messages]);


  function createTodo() {
  const content = window.prompt("Todo content");
  if (!content) return; // 如果输入为空，直接返回
  client.models.Todo.create({ content })
    .then(() => {
      console.log("Todo created successfully");
    })
    .catch((err) => {
      console.error("Failed to create Todo:", err);
    });
}

    
  function deleteTodo(id: string) {
  if (!window.confirm("Are you sure you want to delete this todo?")) return;
  client.models.Todo.delete({ id })
    .then(() => {
      console.log("Todo deleted successfully");
    })
    .catch((err) => {
      console.error("Failed to delete Todo:", err);
    });
}

function sendMessage() {
  if (!chatInput.trim()) return;
  client.models.Message.create({
    content: chatInput,
    sender: user?.signInDetails?.loginId || "Anonymous",
  })
    .then(() => {
      console.log("Message sent");
      setChatInput(""); // 清空输入框
    })
    .catch((err) => {
      console.error("Failed to send message:", err);
    });
}


  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
         {todos.length > 0 ? (
            todos.map((todo) => (
              <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                {todo.content}
              </li>
            ))
          ) : (
            <li>No todos yet. Add one!</li>
          )}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>

      {/* Chat功能 */}
      <section>
        <h2>Chat Room</h2>
        <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </section>
    </main>
  );
}

/**new-add*/



export default App;
