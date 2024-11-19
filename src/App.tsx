import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
    const { user, signOut } = useAuthenticator();
    const senderEmail = user?.signInDetails?.loginId;
    const userN = user.username
    const [messages, setMessages] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [inputValue, setInputValue] = useState<string>("");

    //实时监听数据库数据
    useEffect(() => {
        const subscription = client.models.Todo.observeQuery().subscribe({
            next: (data) => setMessages([...data.items]),
            error: (err) => console.error("Error observing messages:", err),
        });
        return () => subscription.unsubscribe();
    }, []);
 

    // 发送消息
    function sendMessage() {
        if (inputValue.trim()) {
            client.models.Todo.create({ 
              content: inputValue.trim(),
              email:senderEmail,
              username:userN});
            setInputValue(""); // 清空输入框
        }
    }

    return (
      // 主界面
      <main style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start', //内容从顶部开始排列
        background: 'linear-gradient(to bottom right, #ffc0cb, #fff0f5)', // 淡粉色渐变背景
        height: '100vh', // 页面高度为视口高度
        width: '100vw',  // 页面宽度为视口宽度
        margin: 0, // 去除外边距
        padding: 0, // 去除内边距
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden', // 防止超出视口滚动
      }}>
          <h1>  </h1>
  
          {/* 标题 */}
          <div style={{
              display: 'flex', 
              justifyContent: 'center',  // 水平居中
              alignItems: 'center', // 垂直居中
              width: '800px', 
              paddingBottom: '20px',
          }}>
              <h1 style={{
                  margin: 0, 
                  fontWeight: 'bold',
                  marginBottom: '40px', // 提高标题与内容的距离
                  color: '#ff69b4', 
                  fontSize: '50px', // 标题字体增大
              }}> Welcome back!  {user?.signInDetails?.loginId}</h1>
          </div>
  
          {/* 聊天消息框 */}
          <div style={{
              border: '1px solid #ddd',
              padding: '30px',
              width: '1500px',
              height: '800px',
              overflowY: 'scroll',
              backgroundColor: '#ffffff', // 将纯色背景替换为图片背景
              borderRadius: '15px',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              backgroundImage: 'url("/working_cat.png")', // 替换为图片路径
              backgroundSize: 'cover', // 背景图片铺满聊天框
              backgroundRepeat: 'no-repeat', // 不重复
              backgroundPosition: 'center', // 居中显示背景
          }}>
              {messages.map((message) => {
                  const isCurrentUser = (message.email === (user?.signInDetails?.loginId || user.username));
                  return (
                      <div key={message.id} style={{
                          display: 'flex',
                          flexDirection: isCurrentUser ? 'row-reverse' : 'row', // 当前用户消息靠右，其他消息靠左
                          alignItems: 'center',
                          gap: '20px',
                      }}>
                         {/* 用户信息 */}
                          <div style={{
                              maxWidth: '25%',
                              padding: '20px 30px',
                              backgroundColor: isCurrentUser ? '#ffa07a' : '#ecf0f1', // 当前用户橘色，其他灰色
                              color: isCurrentUser ? '#fff' : '#2c3e50',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              textAlign: 'left',
                              wordBreak: 'break-word',
                              fontSize: '24px', // 字体大小增加
                          }}>
                              <p style={{ margin: 0 }}>{message.email}</p>
                          </div>
                          {/* 消息气泡 */}
                          <div style={{
                              maxWidth: '70%',
                              padding: '20px 30px',
                              backgroundColor: isCurrentUser ? '#ffa07a' : '#ecf0f1',
                              color: isCurrentUser ? '#fff' : '#2c3e50',
                              borderRadius: isCurrentUser ? '15px 0 15px 15px' : '0 15px 15px 15px', // 当前用户气泡右上角
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              textAlign: 'left',
                              wordBreak: 'break-word',
                              fontSize: '24px', // 聊天内容字体大小增加2倍
                          }}>
                              <p style={{ margin: 0 }}>{message.content}</p>
                          </div>
                      </div>
                  );
              })}
          </div>
  
          {/* 输入框和发送按钮 */}
          <div style={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '1000px', 
              marginTop: '40px', 
              gap: '20px',
          }}>
              <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    fontSize: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff', // 这会被背景图替换
                    outline: 'none',
                    backgroundImage: 'url("/cat_paw.png")', // 替换成图片路径
                    backgroundSize: 'cover', // 背景图片铺满输入框
                    backgroundRepeat: 'no-repeat',
                    color: '#2c3e50', // 输入文字颜色
                    backgroundPosition: 'center',
                  }}
              />
              <button onClick={sendMessage} style={{
                  padding: '20px 40px', 
                  borderRadius: '20px',
                  backgroundColor: '#3498db', 
                  color: '#fff', 
                  cursor: 'pointer',
                  fontWeight: 'bold', 
                  fontSize: '20px', 
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s, background-color 0.3s',
              }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#2980b9';
                      e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#3498db';
                      e.currentTarget.style.transform = 'scale(1)';
                  }}
              >Send
              </button>
          </div>
  
          {/* Sign out 按钮，放置在发送按钮下方 */}
          <button onClick={signOut} style={{
              marginTop: '80px', // 增加按钮与 Send 的垂直距离
              padding: '15px 30px', // 放大按钮的尺寸
              borderRadius: '8px', 
              backgroundColor: '#FFFF00', // 背景色
              color: '#ff69b4', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '36px', // 字体调整大小
              border: 'none',
              boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',// 放大阴影
              textAlign: 'center',
              transition: 'transform 0.3s',
          }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >Sign out
          </button>
      </main>
  );
}

export default App;
