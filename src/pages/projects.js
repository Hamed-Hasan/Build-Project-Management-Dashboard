import React from 'react';
import { useQuery } from 'react-query';
import axios from '../data/projects'; 
import { Button, Table } from 'antd';

const fetchProjects = async () => {
    const { data } = await axios.get('/projects');
    return data.projects;
};

const ProjectsPage = () => {
    const { data, error, isLoading, isError } = useQuery('projects', fetchProjects);

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button type="link">View</Button>
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Table dataSource={data} columns={columns} rowKey="id" />
        </div>
    );
};

export default ProjectsPage;
