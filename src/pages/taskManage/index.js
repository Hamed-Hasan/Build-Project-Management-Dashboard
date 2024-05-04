
import { useRouter } from 'next/router';
import TaskManagement from '@/components/TaskManagement/TaskManagement';

const TaskManagementPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  if (!projectId) {
    return <div>Please provide a valid project ID.</div>;
  }

  // Convert projectId to a number 
  return <TaskManagement projectId={parseInt(projectId, 10)} />;
};

export default TaskManagementPage;
