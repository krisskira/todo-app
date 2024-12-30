import "./App.css";
import { TodoList } from "./share/components/TodoList";

function App() {
  return (
    <>
      <TodoList
        completed={false}
        createdAt={new Date()}
        description="This is a todo item"
        uuid="1"
        title="Todo Item"
      />
    </>
  );
}

export default App;
