import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import { useRouter } from 'next/router';
import useProjectsStore from "@/store/projectsStore";
import EditProjectModal from "@/components/Update/EditProjectModal";

const ProjectsPage = () => {
  const {
    projects,
    filteredProjects,
    fetchProjects,
    filterProjects,
    removeProject,
    editProject,
    loading,
    error
  } = useProjectsStore((state) => ({
    projects: state.projects,
    filteredProjects: state.filteredProjects,
    fetchProjects: state.fetchProjects,
    filterProjects: state.filterProjects,
    removeProject: state.removeProject,
    editProject: state.editProject,
    loading: state.loading,
    error: state.error
  }));

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const showEditModal = (id) => {
    setCurrentProjectId(id);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    setIsModalVisible(false);
    message.success("Project updated successfully");
    fetchProjects();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  
  

  const viewRecord = (id) => {
    console.log("Viewing record:", id);
    router.push(`/projects/projectDetails/${id}`);
  };


  const deleteRecord = (id) => {
    removeProject(id);
    message.success("Record deleted successfully");
  };

  const handleSearchChange = (e) => {
    filterProjects(e.target.value);
  };

  const navigateToTaskManage = (projectId) => {
    router.push(`/taskManage?projectId=${projectId}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (text) => `$${text.toLocaleString()}`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let backgroundColor;
        let color = "#fff";

        switch (status) {
          case "Active":
            backgroundColor = "#52c41a";
            break;
          case "On Hold":
            backgroundColor = "#faad14";
            break;
          case "Completed":
            backgroundColor = "#1890ff";
            break;
          case "Planning":
            backgroundColor = "#d9d9d9";
            break;
          default:
            backgroundColor = "#ff4d4f";
        }

        return (
          <span
            style={{
              backgroundColor,
              color,
              padding: "2px 5px",
              borderRadius: "4px",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => viewRecord(record.id)}
          >
            View
          </Button>
          <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => showEditModal(record.id)}
      >
        Edit
      </Button>

          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteRecord(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
 

  if (loading) {
    return <Skeleton active />;
  }

  if (error) {
    return <span>Error: {error}</span>;
  }

  return (
    <div style={{ padding: "20px 40px" }}>
       <div className="flex items-center justify-between">
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <Input
          placeholder="Search projects..."
          onChange={handleSearchChange}
          style={{ width: "300px", borderRadius: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
  <Input.Group compact>
    <Select
      style={{ width: 300 }}
      placeholder="Select a Project"
      onChange={(value) => setSelectedProjectId(value)}
    >
      {projects.map((project) => (
        <Select.Option key={project.id} value={project.id}>
          {project.name}
        </Select.Option>
      ))}
    </Select>
    <Button
      type="link"
      icon={<PlusOutlined />}
      onClick={() => {
        if (selectedProjectId) {
          navigateToTaskManage(selectedProjectId);
        } else {
          message.error("Please select a project first");
        }
      }}
    >
      Manage Tasks
    </Button>
  </Input.Group>
</div>

    </div>
      <div style={{ padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "#fff" }}>
        <Table dataSource={filteredProjects} columns={columns} rowKey="id" />
      </div>


      <EditProjectModal
        visible={isModalVisible}
        onEdit={handleEdit}
        onCancel={handleCancel}
        projectId={currentProjectId}
      />
    </div>
  );
};

export default ProjectsPage;
