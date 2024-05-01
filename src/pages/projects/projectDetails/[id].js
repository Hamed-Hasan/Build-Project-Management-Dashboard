import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Descriptions, List, Skeleton, Tag, Typography } from 'antd';
import useProjectsStore from '@/store/projectsStore';

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const { projectDetails, fetchProjectDetails, loading, error } = useProjectsStore((state) => ({
    projectDetails: state.projectDetails,
    fetchProjectDetails: state.fetchProjectDetails,
    loading: state.loading,
    error: state.error
  }));

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id, fetchProjectDetails]);

  if (loading) return <Skeleton active />;
  if (error) return <Typography.Text type="danger">{`Error: ${error}`}</Typography.Text>;
  if (!projectDetails) return <p>No project data available</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card title={`Project Details - ${projectDetails.name}`} bordered={false} className="shadow-lg">
        <Descriptions title="Project Info" bordered column={1} className="bg-white">
          <Descriptions.Item label="ID">{projectDetails.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={projectDetails.status === 'Active' ? 'green' : projectDetails.status === 'On Hold' ? 'orange' : 'volcano'}>
              {projectDetails.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Budget">${projectDetails.budget.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{new Date(projectDetails.startDate).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="End Date">{new Date(projectDetails.endDate).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
        <Typography.Title level={4} className="mt-8">Tasks</Typography.Title>
        <List
          dataSource={projectDetails.tasks}
          renderItem={item => (
            <List.Item className="border-b last:border-b-0">
              {item.name} -{' '}
              <Tag color={item.status === 'Completed' ? 'blue' : item.status === 'In Progress' ? 'geekblue' : 'gray'}>
                {item.status}
              </Tag>
            </List.Item>
          )}
        />
        <Typography.Title level={4} className="mt-8">Team Members</Typography.Title>
        <List
          dataSource={projectDetails.teamMembers}
          renderItem={item => (
            <List.Item className="border-b last:border-b-0">
              {item.name} - {item.role}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ProjectDetails;
