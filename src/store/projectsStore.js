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

  addTask: async (task) => {
    set({ loading: true });
    try {
      const response = await axios.post('/tasks', task);
      set({ loading: false });
      return response.data.task;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  editTask: async (taskId, taskData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/tasks/${taskId}`, taskData);
      set({ loading: false });
      return response.data.task;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteTask: async (taskId, projectId) => {
    set({ loading: true });
    try {
      await axios.delete(`/tasks/${taskId}`);
      // Directly update the task list in the state
      const updatedTasks = get().tasks.filter(task => task.id !== taskId);
      set({ tasks: updatedTasks, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },  

  addTeamMember: async (projectId, memberData) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/projects/${projectId}/team`, memberData);
      set({ loading: false });
      return response.data.member;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTasks: async (projectId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/projects/${projectId}/tasks`);
      return response.data.tasks || []; // Ensure an empty array is returned if no tasks
    } catch (error) {
      set({ error: error.message, loading: false });
      return []; // Return empty array in case of error
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
