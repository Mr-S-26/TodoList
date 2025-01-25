import Project from './Project';

class ProjectManager {
  constructor() {
    this.projects = [];
    this.defaultProject = new Project('Default Project');
    this.projects.push(this.defaultProject);
  }

  addProject(project) {
    if (project instanceof Project) {
      this.projects.push(project);
    }
  }

  removeProject(project) {
    this.projects = this.projects.filter(p => p !== project);
  }

  getProjects() {
    return this.projects;
  }

  getDefaultProject() {
    return this.defaultProject;
  }
}

export default ProjectManager;