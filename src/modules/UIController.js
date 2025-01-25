// src/modules/UIController.js
import Project from './Project';
import TodoItem from './TodoItem';

class UIController {
  constructor(projectManager) {
    this.projectManager = projectManager;
    this.currentProject = this.projectManager.getDefaultProject();
    this.bindEventListeners();
  }

  bindEventListeners() {
    document.getElementById('projectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createProject();
    });

    document.getElementById('todoForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createTodo();
    });
  }

  createProject() {
    const projectName = document.getElementById('projectName').value;
    if (projectName) {
      const newProject = new Project(projectName);
      this.projectManager.addProject(newProject);
      this.renderProjects();
      this.saveProjectsToLocalStorage();
      document.getElementById('projectForm').reset();
    }
  }

  createTodo() {
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const dueDate = document.getElementById('todoDueDate').value;
    const priority = document.getElementById('todoPriority').value;
    if (title && dueDate) {
      const newTodo = new TodoItem(title, description, dueDate, priority);
      this.currentProject.addTodoItem(newTodo);
      this.renderTodos(this.currentProject);
      this.saveProjectsToLocalStorage();
      document.getElementById('todoForm').reset();
    }
  }

  renderProjects() {
    const projectContainer = document.getElementById('projectContainer');
    projectContainer.innerHTML = '';

    this.projectManager.getProjects().forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project';
      projectElement.textContent = project.name;
      projectElement.addEventListener('click', () => {
        this.currentProject = project;
        this.renderTodos(project);
      });

      const editButton = document.createElement('button');
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.title = 'Edit Project';
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editProjectDetails(project);
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.title = 'Delete Project';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.projectManager.removeProject(project);
        this.renderProjects();
        this.saveProjectsToLocalStorage();
      });

      projectElement.appendChild(editButton);
      projectElement.appendChild(deleteButton);
      projectContainer.appendChild(projectElement);
    });
  }

  renderTodos(project) {
    const todoContainer = document.getElementById('todoContainer');
    todoContainer.innerHTML = '';

    project.getTodoItems().forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo ${this.getPriorityClass(todo.priority)}`;
      todoElement.textContent = `${todo.title} (Due: ${todo.dueDate})`;
      todoElement.addEventListener('click', () => this.expandTodoDetails(todo));

      const editButton = document.createElement('button');
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.title = 'Edit Todo';
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editTodoDetails(todo);
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.title = 'Delete Todo';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentProject.removeTodoItem(todo);
        this.renderTodos(this.currentProject);
        this.saveProjectsToLocalStorage();
      });

      todoElement.appendChild(editButton);
      todoElement.appendChild(deleteButton);
      todoContainer.appendChild(todoElement);
    });
  }

  expandTodoDetails(todo) {
    const todoDetailsContainer = document.getElementById('todoDetailsContainer');
    todoDetailsContainer.innerHTML = '';

    const titleElement = document.createElement('h2');
    titleElement.textContent = todo.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = todo.description;

    const dueDateElement = document.createElement('p');
    dueDateElement.textContent = `Due Date: ${todo.dueDate}`;

    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Priority: ${todo.priority}`;

    const completeButton = document.createElement('button');
    completeButton.innerHTML = todo.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
    completeButton.title = todo.completed ? 'Mark as Incomplete' : 'Mark as Complete';
    completeButton.addEventListener('click', () => {
      todo.toggleComplete();
      this.expandTodoDetails(todo);
      this.saveProjectsToLocalStorage();
    });

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.title = 'Edit Todo';
    editButton.addEventListener('click', () => this.editTodoDetails(todo));

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.title = 'Delete Todo';
    deleteButton.addEventListener('click', () => {
      this.currentProject.removeTodoItem(todo);
      this.renderTodos(this.currentProject);
      this.saveProjectsToLocalStorage();
    });

    todoDetailsContainer.appendChild(titleElement);
    todoDetailsContainer.appendChild(descriptionElement);
    todoDetailsContainer.appendChild(dueDateElement);
    todoDetailsContainer.appendChild(priorityElement);
    todoDetailsContainer.appendChild(completeButton);
    todoDetailsContainer.appendChild(editButton);
    todoDetailsContainer.appendChild(deleteButton);
  }

  editTodoDetails(todo) {
    document.getElementById('todoTitle').value = todo.title;
    document.getElementById('todoDescription').value = todo.description;
    document.getElementById('todoDueDate').value = todo.dueDate;
    document.getElementById('todoPriority').value = todo.priority;

    const submitButton = document.querySelector('#todoForm button[type="submit"]');
    submitButton.textContent = 'Update Todo';
    submitButton.addEventListener('click', () => {
      todo.updateDetails({
        title: document.getElementById('todoTitle').value,
        description: document.getElementById('todoDescription').value,
        dueDate: document.getElementById('todoDueDate').value,
        priority: document.getElementById('todoPriority').value,
      });
      this.renderTodos(this.currentProject);
      this.saveProjectsToLocalStorage();
      submitButton.textContent = 'Add Todo';
    }, { once: true });
  }

  editProjectDetails(project) {
    document.getElementById('projectName').value = project.name;

    const submitButton = document.querySelector('#projectForm button[type="submit"]');
    submitButton.textContent = 'Update Project';
    submitButton.addEventListener('click', () => {
      project.name = document.getElementById('projectName').value;
      this.renderProjects();
      this.saveProjectsToLocalStorage();
      submitButton.textContent = 'Add Project';
    }, { once: true });
  }

  getPriorityClass(priority) {
    switch (priority) {
      case 'Low':
        return 'low-priority';
      case 'Medium':
        return 'medium-priority';
      case 'High':
        return 'high-priority';
      default:
        return '';
    }
  }

  saveProjectsToLocalStorage() {
    const projects = this.projectManager.getProjects();
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  loadProjectsFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('projects'));
    if (projects) {
      projects.forEach(projectData => {
        const project = new Project(projectData.name);
        projectData.todos.forEach(todoData => {
          const todo = new TodoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
          if (todoData.completed) {
            todo.toggleComplete();
          }
          project.addTodoItem(todo);
        });
        this.projectManager.addProject(project);
      });
    }
  }
}

export default UIController;