import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';


const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

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

  return (
    <main>
      <h1>My todos</h1>
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
    </main>
  );
}

export default App;
