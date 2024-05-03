import React, { useEffect, useState } from "react";
import { Button, Input, Table, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import { useRouter } from 'next/router';
import useProjectsStore from "@/store/projectsStore";
import EditModal from "@/components/Update/EditModal";

const ProjectsPage = () => {
  const {
    projects,
    fetchProjects,
    filterProjects,
    removeProject,
    loading,
    error,
    updateProject,
  } = useProjectsStore((state) => ({
    projects: state.projects,
    fetchProjects: state.fetchProjects,
    filterProjects: state.filterProjects,
    removeProject: state.removeProject,
    loading: state.loading,
    error: state.error,
    updateProject: state.updateProject,
  }));

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    setFilteredProjects(filterProjects(searchTerm));
  }, [filterProjects, projects, searchTerm]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const showEditModal = (record) => {
    setEditingProject(record);
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingProject(null);
  };

 
  const handleUpdate = (updatedProject) => {
    console.log('handleUpdate called in ProjectsPage with:', updatedProject);
    updateProject(updatedProject);
    setEditModalVisible(false);
    setEditingProject(null);
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const router = useRouter();

  const viewRecord = (id) => {
    console.log("Viewing record:", id);
    router.push(`/projects/projectDetails/${id}`);
  };

  const editRecord = (record) => {
    showEditModal(record);
  };

  const deleteRecord = (id) => {
    removeProject(id);
    message.success("Record deleted successfully");
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
            onClick={() => editRecord(record.id)}
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
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <Input
          placeholder="Search projects..."
          onChange={handleSearchChange}
          style={{ width: "300px", borderRadius: "4px" }}
        />
      </div>
      <div style={{ padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "#fff" }}>
        <Table dataSource={filteredProjects} columns={columns} rowKey="id" />
      </div>

      <EditModal
        project={editingProject}
        visible={editModalVisible}
        onUpdate={handleUpdate}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default ProjectsPage;
