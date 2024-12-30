import { FC } from "react";
import { Todo } from "todo-types";

export const TodoList: FC<Todo> = (props) => {
  const { completed, createdAt, description, uuid, title } = props;
  return (
    <div key={uuid}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Created at: {createdAt.toString()}</p>
      <p>Completed: {completed ? "Yes" : "No"}</p>

      <button>Edit</button>
    </div>
  );
};
