// src/modules/Project.js
import TodoItem from './TodoItem';

class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodoItem(todo) {
    if (todo instanceof TodoItem) {
      this.todos.push(todo);
    }
  }

  removeTodoItem(todo) {
    this.todos = this.todos.filter(t => t !== todo);
  }

  getTodoItems() {
    return this.todos;
  }
}

export default Project;