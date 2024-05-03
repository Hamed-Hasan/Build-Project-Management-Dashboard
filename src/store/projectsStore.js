import create from 'zustand';
import axios from '../data/projects'; 

const useProjectsStore = create((set, get) => ({
  projects: [],
  filteredProjects: [],
  loading: true,
  projectDetails: null,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/projects');
      set({ projects: response.data.projects, filteredProjects: response.data.projects, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProjectDetails: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/projects/${id}`);
      const projectData = response.data.projects.find(p => p.id.toString() === id);
      set({ projectDetails: projectData, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  filterProjects: (searchTerm) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = get().projects.filter(project =>
      project.name.toLowerCase().includes(lowerCaseTerm) ||
      project.description.toLowerCase().includes(lowerCaseTerm) ||
      project.status.toLowerCase().includes(lowerCaseTerm)
    );
    set({ filteredProjects: filtered });
  },

  removeProject: (id) => {
    const updatedProjects = get().projects.filter(project => project.id !== id);
    set({ projects: updatedProjects, filteredProjects: updatedProjects });
  },

  editProject: async (id, updatedData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/projects/${id}`, updatedData);
      const updatedProjects = get().projects.map(project =>
        project.id === id ? response.data.project : project
      );
      set({
        projects: updatedProjects,
        filteredProjects: updatedProjects,
        projectDetails: response.data.project,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


  fetchTasks: async (projectId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/projects/${projectId}/tasks`);
      set({ loading: false });
      return response.data.tasks;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/tasks/${taskId}/status`, { status });
      set({ loading: false });
      return response.data.task;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


}));

export default useProjectsStore;
