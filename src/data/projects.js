import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mock = new MockAdapter(axios);

mock.onGet("/projects").reply(200, {
    projects: [
        { id: 1, name: 'Project Alpha', description: 'Redesign of the client web portal.', status: 'Active', startDate: '2024-01-10', endDate: '2024-06-10', budget: 120000, tasks: [ { id: 101, name: 'UI Design', status: 'Completed', dueDate: '2024-03-01' }, { id: 102, name: 'Backend Development', status: 'In Progress', dueDate: '2024-04-15' }, { id: 103, name: 'Testing and Deployment', status: 'Pending', dueDate: '2024-05-30' } ], teamMembers: [ { id: 201, name: 'Alice Johnson', role: 'Project Manager' }, { id: 202, name: 'Bob Smith', role: 'Lead Developer' }, { id: 203, name: 'Charlie Doe', role: 'UX Designer' } ] },
        { id: 2, name: 'Project Beta', description: 'Development of new analytics features.', status: 'Planning', startDate: '2024-02-15', endDate: '2024-08-20', budget: 85000, tasks: [ { id: 104, name: 'Requirement Gathering', status: 'Completed', dueDate: '2024-03-20' }, { id: 105, name: 'System Design', status: 'In Progress', dueDate: '2024-04-22' }, { id: 106, name: 'Implementation', status: 'Pending', dueDate: '2024-07-15' } ], teamMembers: [ { id: 204, name: 'Diana Ray', role: 'Data Scientist' }, { id: 205, name: 'Evan Lake', role: 'Software Engineer' } ] },
        { id: 3, name: 'Project Gamma', description: 'Migration of systems to cloud infrastructure.', status: 'On Hold', startDate: '2024-04-01', endDate: '2024-12-31', budget: 200000, tasks: [ { id: 107, name: 'Cloud Selection', status: 'Pending', dueDate: '2024-05-10' }, { id: 108, name: 'Data Migration', status: 'Pending', dueDate: '2024-09-10' }, { id: 109, name: 'Service Testing', status: 'Pending', dueDate: '2024-11-20' } ], teamMembers: [ { id: 206, name: 'Fiona Gables', role: 'Cloud Architect' }, { id: 207, name: 'George King', role: 'Systems Administrator' } ] },
        
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
    ]
});

export default axios;
