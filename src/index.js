import './style.css';
import ProjectManager from './modules/ProjectManager';
import UIController from './modules/UIController';

const projectManager = new ProjectManager();
const uiController = new UIController(projectManager);

document.addEventListener('DOMContentLoaded', () => {
    uiController.loadProjectsFromLocalStorage();
    uiController.renderProjects();
  });