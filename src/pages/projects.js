import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "../data/projects";
import { Button, Input, Table } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import debounce from "lodash/debounce";

const fetchProjects = async () => {
  const { data } = await axios.get("/projects");
  return data.projects;
};

const ProjectsPage = () => {
  const { data, error, isLoading, isError } = useQuery(
    "projects",
    fetchProjects
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const debouncedSearch = debounce((query) => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = data.filter(
        (project) =>
          project.name.toLowerCase().includes(lowerCaseQuery) ||
          project.description.toLowerCase().includes(lowerCaseQuery) ||
          project.status.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, data]);

  if (isLoading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1300px", margin: "auto" }}>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const viewRecord = (id) => {
    console.log("Viewing record:", id);
  };

  const editRecord = (id) => {
    console.log("Editing record:", id);
  };

  const deleteRecord = (id) => {
    console.log("Deleting record:", id);
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
      render: (text, record) => (
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

  return (
<>
    <div style={{ padding: "20px 40px" }}> 
        <div style={{ marginBottom: "20px", textAlign: "right" }}> 
            <Input
                placeholder="Search projects..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "300px", borderRadius: "4px" }}
            />
        </div>
        <div style={{ padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "#fff" }}>
            <Table dataSource={filteredData} columns={columns} rowKey="id" />
        </div>
    </div>
</>

  );
};

export default ProjectsPage;
