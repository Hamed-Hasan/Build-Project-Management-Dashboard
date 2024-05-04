import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Button, Col, Row, Tag, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import useProjectsStore from '@/store/projectsStore';

const { Option } = Select;

// Priority tags mapping
const priorityTags = {
  High: <Tag color="red">High</Tag>,
  Medium: <Tag color="blue">Medium</Tag>,
  Low: <Tag color="green">Low</Tag>,
};

// Initial columns' structure
const initialColumns = {
  'column-todo': { name: 'To Do', tasks: [] },
  'column-in-progress': { name: 'In Progress', tasks: [] },
  'column-done': { name: 'Done', tasks: [] },
};

// `TaskManagement` component with projectId as a prop
const TaskManagement = ({ projectId }) => {
  const {
    fetchTasks,
    updateTaskStatus,
    addTask,
    editTask,
    deleteTask,
  } = useProjectsStore();

  const [columns, setColumns] = useState(initialColumns);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Fetch tasks for the provided project ID
  useEffect(() => {
    async function loadTasks() {
      if (!projectId) {
        message.error('Project ID is not provided');
        return;
      }
      try {
        const tasks = await fetchTasks(projectId);
        const updatedColumns = {
          'column-todo': { ...initialColumns['column-todo'], tasks: tasks.filter(t => t.status === 'Pending') },
          'column-in-progress': { ...initialColumns['column-in-progress'], tasks: tasks.filter(t => t.status === 'In Progress') },
          'column-done': { ...initialColumns['column-done'], tasks: tasks.filter(t => t.status === 'Completed') },
        };
        setColumns(updatedColumns);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        message.error('Failed to load tasks.');
      }
    }
    loadTasks();
  }, [projectId, fetchTasks]);

  // Handle drag and drop between columns
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const reorderedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: reorderedTasks },
      });
    } else {
      // Moving between different columns
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destinationTasks = Array.from(destinationColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destinationColumn.name;
      destinationTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
        [destination.droppableId]: { ...destinationColumn, tasks: destinationTasks },
      });

      // Update the backend status
      try {
        await updateTaskStatus(movedTask.id, destinationColumn.name);
      } catch (error) {
        console.error('Error updating task status:', error);
        message.error('Failed to update task status.');
      }
    }
  };

  // Show modal for adding or editing tasks
  const showModal = (task = null) => {
    setCurrentTask(task);
    setModalVisible(true);
  };

  // Handle modal form submission
  const handleModalOk = async (values) => {
    if (currentTask) {
      // Edit existing task
      try {
        const updatedTask = await editTask(currentTask.id, values);

        const columnKey = Object.keys(columns).find(key =>
          columns[key].tasks.some(task => task.id === currentTask.id)
        );

        if (columnKey) {
          const column = columns[columnKey];
          const updatedTasks = column.tasks.map(task =>
            task.id === currentTask.id ? { ...task, ...updatedTask } : task
          );

          setColumns({ ...columns, [columnKey]: { ...column, tasks: updatedTasks } });
          message.success('Task updated successfully!');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        message.error('Failed to update task.');
      }
    } else {
      // Add a new task
      try {
        const newTask = await addTask({ ...values, status: 'Pending', projectId });
        const updatedColumn = { ...columns['column-todo'], tasks: [...columns['column-todo'].tasks, newTask] };
        setColumns({ ...columns, 'column-todo': updatedColumn });
        message.success('New task added successfully!');
      } catch (error) {
        console.error('Error adding task:', error);
        message.error('Failed to add new task.');
      }
    }
    setModalVisible(false);
  };

  // Delete an existing task
  const deleteExistingTask = async (task) => {
    try {
      await deleteTask(task.id);
      const columnKey = Object.keys(columns).find(key => columns[key].tasks.includes(task));
      const updatedTasks = columns[columnKey].tasks.filter(t => t.id !== task.id);
      setColumns({ ...columns, [columnKey]: { ...columns[columnKey], tasks: updatedTasks } });
      message.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task.');
    }
  };

  // Task form modal
  const TaskForm = ({ task, visible, onOk, onCancel }) => {
    const [form] = Form.useForm();
    useEffect(() => {
      if (task) {
        form.setFieldsValue({ ...task, dueDate: moment(task.dueDate) });
      } else {
        form.resetFields();
      }
    }, [task, form]);

    return (
      <Modal
        title={task ? 'Edit Task' : 'Add Task'}
        visible={visible}
        onCancel={onCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onOk} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // Task card component
  const TaskCard = ({ task }) => (
    <Card
      title={task.title}
      extra={priorityTags[task.priority]}
      className="mb-3"
      actions={[
        <Button type="link" onClick={() => showModal(task)}>Edit</Button>,
        <Button type="link" danger onClick={() => deleteExistingTask(task)}>Delete</Button>,
      ]}
    >
      <p>{task.description}</p>
      <p><strong>Due:</strong> {task.dueDate}</p>
    </Card>
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Col span={8} key={columnId}>
              <h2>{column.name}</h2>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 p-2 rounded-md min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => showModal()}>
                Add Task
              </Button>
            </Col>
          ))}
        </Row>
      </DragDropContext>
      <TaskForm
        task={currentTask}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default TaskManagement;
