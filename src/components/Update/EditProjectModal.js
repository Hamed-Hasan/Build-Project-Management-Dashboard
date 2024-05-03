import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment';
import useProjectsStore from '@/store/projectsStore';

const EditProjectModal = ({ visible, onEdit, onCancel, projectId }) => {
  const [form] = Form.useForm();
  const { projects, editProject } = useProjectsStore(state => ({
    projects: state.projects,
    editProject: state.editProject
  }));

  useEffect(() => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: moment(project.startDate),
        endDate: moment(project.endDate),
        budget: project.budget
      });
    }
  }, [projectId, projects, form, visible]);

  const handleOk = async () => {
    const values = await form.validateFields();
    values.startDate = values.startDate.format('YYYY-MM-DD');
    values.endDate = values.endDate.format('YYYY-MM-DD');
    editProject(projectId, values).then(() => {
      onEdit();
    });
  };

  return (
    <Modal
      title="Edit Project"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select placeholder="Select a status">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Planning">Planning</Select.Option>
            <Select.Option value="On Hold">On Hold</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="MMMM D, YYYY" />
        </Form.Item>
        <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="MMMM D, YYYY" />
        </Form.Item>
        <Form.Item name="budget" label="Budget" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
