import React from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const EditModal = ({ project, onUpdate, visible, onCancel }) => {
  const [form] = Form.useForm();

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
  
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };
  
      console.log('Formatted values:', formattedValues);
  
      const updatedProject = { ...project, ...formattedValues };
      console.log('Updated project:', updatedProject);
  
      onUpdate(updatedProject);
    });
  };
  

  return (
    <Modal
      visible={visible}
      title="Edit Project"
      okText="Update"
      cancelText="Cancel"
      onOk={handleUpdate}
      onCancel={onCancel}
      width={800} 
    >
      <Form
        form={form}
        layout="vertical" 
        initialValues={project}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the project name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the project description' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the project status' }]}
        >
          <Select placeholder="Select a status">
            <Option value="Active">Active</Option>
            <Option value="Planning">Planning</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select the start date' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select the end date' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="budget"
          label="Budget"
          rules={[{ required: true, message: 'Please input the budget' }]}
        >
          <InputNumber
            min={0}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
