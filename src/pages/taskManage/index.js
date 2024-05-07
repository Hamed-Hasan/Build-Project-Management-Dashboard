import { useRouter } from 'next/router';
import TaskManagement from '@/components/TaskManagement/TaskManagement';
import { Spin, Row, Col } from 'antd';

const ProjectTasksPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  if (!projectId) {
    return (
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <Spin size="large" tip="Loading project tasks..." />
        </Col>
      </Row>
    );
  }

  return <TaskManagement projectId={parseInt(projectId, 10)} />;
};

export default ProjectTasksPage;
