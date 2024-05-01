import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../../data/projects';
import { Card, Descriptions, List, Skeleton, Tag, Typography } from 'antd';

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`/projects/${id}`)
        .then((res) => {
          const projectData = res.data.projects.find(p => p.id.toString() === id);
          console.log('Project data:', projectData);
          setProject(projectData);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch project: ' + err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <Skeleton active />;
  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>No project data available</p>;

  return (
    <Card title={`Project Details - ${project.name}`} bordered={false}>
      <Descriptions title="Project Info" bordered>
        <Descriptions.Item label="ID">{project.id}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={project.status === 'Active' ? 'green' : project.status === 'On Hold' ? 'orange' : 'volcano'}>
            {project.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Budget">${project.budget.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Start Date">{new Date(project.startDate).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="End Date">{new Date(project.endDate).toLocaleDateString()}</Descriptions.Item>
      </Descriptions>
      <Typography.Title level={4}>Tasks</Typography.Title>
      <List
        dataSource={project.tasks}
        renderItem={item => (
          <List.Item>
            {item.name} -{' '}
            <Tag color={item.status === 'Completed' ? 'blue' : item.status === 'In Progress' ? 'geekblue' : 'gray'}>
              {item.status}
            </Tag>
          </List.Item>
        )}
      />
      <Typography.Title level={4}>Team Members</Typography.Title>
      <List
        dataSource={project.teamMembers}
        renderItem={item => (
          <List.Item>
            {item.name} - {item.role}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ProjectDetails;
