class TodoItem {
    constructor(title, description, dueDate, priority) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.completed = false;
    }
  
    toggleComplete() {
      this.completed = !this.completed;
    }
  
    updateDetails({ title, description, dueDate, priority }) {
      if (title) this.title = title;
      if (description) this.description = description;
      if (dueDate) this.dueDate = dueDate;
      if (priority) this.priority = priority;
    }
  }
  
  export default TodoItem;