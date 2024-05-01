import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mock = new MockAdapter(axios);

mock.onGet("/projects").reply(200, {
    projects: [
        { id: 1, name: 'Project 1', description: 'Description of Project 1' },
        { id: 2, name: 'Project 2', description: 'Description of Project 2' },
        { id: 3, name: 'Project 3', description: 'Description of Project 3' }
    ]
});

export default axios;
