import create from 'zustand';
import axios from '../data/projects'; 

const useProjectsStore = create((set, get) => ({
  projects: [],
  filteredProjects: [],
  loading: true,
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
  }
}));

export default useProjectsStore;
