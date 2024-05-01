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
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (text) => `$${text.toLocaleString()}`,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let backgroundColor;
                let color = '#fff'; 
    
                switch (status) {
                    case 'Active':
                        backgroundColor = '#52c41a'; 
                        break;
                    case 'On Hold':
                        backgroundColor = '#faad14'; 
                        break;
                    case 'Completed':
                        backgroundColor = '#1890ff'; 
                        break;
                    case 'Planning':
                        backgroundColor = '#d9d9d9'; 
                        break;
                    default:
                        backgroundColor = '#ff4d4f'; 
                }
    
                return (
                    <span style={{ backgroundColor, color, padding: '2px 5px', borderRadius: '4px' }}>
                        {status}
                    </span>
                );
            },
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
