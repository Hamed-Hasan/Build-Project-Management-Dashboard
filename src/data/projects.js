import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const projects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Redesign of the client web portal.',
    status: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-06-10',
    budget: 120000,
    tasks: [
      { id: 101, name: 'UI Design', status: 'Completed', dueDate: '2024-03-01' },
      { id: 102, name: 'Backend Development', status: 'In Progress', dueDate: '2024-04-15' },
      { id: 103, name: 'Testing and Deployment', status: 'Pending', dueDate: '2024-05-30' }
    ],
    teamMembers: [
      { id: 201, name: 'Alice Johnson', role: 'Project Manager' },
      { id: 202, name: 'Bob Smith', role: 'Lead Developer' },
      { id: 203, name: 'Charlie Doe', role: 'UX Designer' }
    ]
  },
  ...Array.from({ length: 18 }).map((_, index) => ({
    id: 4 + index,
    name: `Project ${String.fromCharCode(68 + index)}`,
    description: `Project ${String.fromCharCode(68 + index)} description.`,
    status: ['Active', 'Planning', 'On Hold', 'Completed'][Math.floor(Math.random() * 4)],
    startDate: `2024-${Math.floor(Math.random() * 12) + 1}-01`,
    endDate: `2025-${Math.floor(Math.random() * 12) + 1}-01`,
    budget: Math.floor(Math.random() * 100000) + 50000,
    tasks: [
      { id: 110 + index * 3, name: 'Initial Planning', status: ['Completed', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)], dueDate: '2024-07-01' },
      { id: 111 + index * 3, name: 'Development Phase', status: ['Completed', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)], dueDate: '2024-08-15' },
      { id: 112 + index * 3, name: 'Final Review', status: ['Completed', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)], dueDate: '2024-09-30' }
    ],
    teamMembers: [
      { id: 210 + index * 3, name: `Team Member ${1 + index * 3}`, role: 'Developer' },
      { id: 211 + index * 3, name: `Team Member ${2 + index * 3}`, role: 'Tester' },
      { id: 212 + index * 3, name: `Team Member ${3 + index * 3}`, role: 'Project Lead' }
    ]
  }))
];

mock.onGet('/projects').reply(200, { projects });

mock.onGet(/\/projects\/\d+/).reply(config => {
  const projectId = parseInt(config.url.split('/').pop());
  const project = projects.find(p => p.id === projectId);
  return [200, { projects: [project] }];
});

mock.onPut(/\/projects\/\d+/).reply(config => {
  const projectId = parseInt(config.url.split('/').pop());
  const updatedProject = JSON.parse(config.data); 
  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };
    return [200, { project: projects[projectIndex] }];
  }
  return [404, { message: 'Project not found' }];
});

// Mock for adding a new task
mock.onPost('/tasks').reply(config => {
  const task = JSON.parse(config.data);
  // Assuming tasks have unique IDs and are stored with the project
  const project = projects.find(p => p.id === task.projectId);
  if (project) {
    const newTaskId = Math.max(...project.tasks.map(t => t.id)) + 1;
    const newTask = { ...task, id: newTaskId };
    project.tasks.push(newTask);
    return [200, { task: newTask }];
  }
  return [400, { message: 'Project not found' }];
});

// Mock for updating a task
mock.onPut(/\/tasks\/\d+/).reply(config => {
  const taskId = parseInt(config.url.split('/').pop());
  const updatedTaskInfo = JSON.parse(config.data);
  const project = projects.find(p => p.tasks.some(t => t.id === taskId));
  if (project) {
    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...updatedTaskInfo };
      return [200, { task: project.tasks[taskIndex] }];
    }
  }
  return [404, { message: 'Task not found' }];
});

// Mock for deleting a task
mock.onDelete(/\/tasks\/\d+/).reply(config => {
  const taskId = parseInt(config.url.split('/').pop());
  const project = projects.find(p => p.tasks.some(t => t.id === taskId));
  if (project) {
    const tasksBeforeDeletion = project.tasks.length;
    project.tasks = project.tasks.filter(t => t.id !== taskId);
    if (tasksBeforeDeletion > project.tasks.length) {
      return [200, { message: 'Task deleted' }];
    }
  }
  return [404, { message: 'Task not found' }];
});

// Mock for adding a team member to a project
mock.onPost(/\/projects\/\d+\/team/).reply(config => {
  const projectId = parseInt(config.url.split('/projects/').pop().split('/team')[0]);
  const newMember = JSON.parse(config.data);
  const project = projects.find(p => p.id === projectId);
  if (project) {
    const newMemberId = Math.max(...project.teamMembers.map(m => m.id)) + 1;
    const memberToAdd = { ...newMember, id: newMemberId };
    project.teamMembers.push(memberToAdd);
    return [200, { member: memberToAdd }];
  }
  return [404, { message: 'Project not found' }];
});


// Mock for fetching a list of tasks for a specific project
mock.onGet(/\/projects\/\d+\/tasks/).reply(config => {
  const projectId = parseInt(config.url.split('/projects/').pop().split('/tasks')[0]);
  const project = projects.find(p => p.id === projectId);
  if (project) {
    return [200, { tasks: project.tasks }];
  }
  return [404, { message: 'Project not found' }];
});

// Mock for updating the status of a task via a drag-and-drop interaction
mock.onPut(/\/tasks\/\d+\/status/).reply(config => {
  const taskId = parseInt(config.url.split('/tasks/').pop().split('/status')[0]);
  const newStatus = JSON.parse(config.data).status;
  const project = projects.find(p => p.tasks.some(t => t.id === taskId));
  if (project) {
    const task = project.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      return [200, { task }];
    }
  }
  return [404, { message: 'Task not found' }];
});


export default axios;