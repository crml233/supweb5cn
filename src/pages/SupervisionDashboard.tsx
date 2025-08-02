import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '@/components/Supervision/Sidebar';
import TaskList from '@/components/Supervision/TaskList';
import TaskForm from '@/components/Supervision/TaskForm';
import ReportSection from '@/components/Supervision/ReportSection';
import ReminderSection from '@/components/Supervision/ReminderSection';
import DelaySection from '@/components/Supervision/DelaySection';
import { SupervisionReport, SupervisionTask, mockReports, mockTasks } from '@/mocks/supervisionData';
import { supervisionAPI } from '@/lib/api';

export default function SupervisionDashboard() {
  const [activeSection, setActiveSection] = useState('my-tasks');
  const [tasks, setTasks] = useState<SupervisionTask[]>([]);
  const [reports, setReports] = useState<SupervisionReport[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<SupervisionTask | null>(null);
  
  // 从API加载数据
  useEffect(() => {
    const loadData = async () => {
      const tasksData = await supervisionAPI.getTasks();
      const reportsData = await supervisionAPI.getReports();
      
      setTasks(tasksData);
      setReports(reportsData);
    };
    
    loadData();
  }, []);
  
  // 添加新任务
  const handleAddTask = async (taskData: Omit<SupervisionTask, 'id' | 'createdAt'>) => {
    const newTask = await supervisionAPI.createTask(taskData);
    setTasks([...tasks, newTask]);
  };
  
  // 更新任务
  const handleUpdateTask = async (updatedTaskData: Omit<SupervisionTask, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    const updatedTask = await supervisionAPI.updateTask(editingTask.id, updatedTaskData);
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    
    setEditingTask(null);
  };
  
  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    await supervisionAPI.deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    setReports(reports.filter(report => report.taskId !== taskId));
  };
  
  // 添加督办报告
  const handleAddReport = async (taskId: string, reportContent: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const newReportData = {
      taskId,
      month: currentMonth,
      reportContent,
      status: 'completed' as const
    };
    
    const newReport = await supervisionAPI.createReport(newReportData);
    setReports([...reports, newReport]);
  };
  
  // 更新任务完成时限
  const handleUpdateDeadline = async (taskId: string, newDeadline: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 保存原完成时限到 originalDeadline（只设置一次）
    const updateData: Partial<SupervisionTask> = { 
      deadline: newDeadline, // 更新主时限（会反映在"我的督办"中）
      newDeadline: newDeadline // 存储新时限用于延期管理显示
    };
    
    // 如果是第一次设置延期，保存原始时限
    if (!task.originalDeadline) {
      updateData.originalDeadline = task.deadline;
    }
    
    // 获取当前日期用于状态判断
    const currentDate = new Date().toISOString().split('T')[0];
    
    // 只在"我的督办"中更新状态，基于新的完成时限
    updateData.status = newDeadline < currentDate ? 'delayed' : 'pending';
    
    const updatedTask = await supervisionAPI.updateTask(taskId, updateData);
    
     setTasks(tasks.map(task => 
       task.id === taskId ? updatedTask : task
     ));
   };
   
   // 编辑督办报告
   const handleEditReport = async (reportId: string, reportContent: string) => {
     const updatedReport = await supervisionAPI.updateReport(reportId, { reportContent });
     setReports(reports.map(report => 
       report.id === reportId ? updatedReport : report
     ));
   };
   
   // 删除督办报告
   const handleDeleteReport = async (reportId: string) => {
     await supervisionAPI.deleteReport(reportId);
     setReports(reports.filter(report => report.id !== reportId));
   };

  
  // 打开编辑任务表单
  const handleEditTask = (task: SupervisionTask) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };
  
  // 渲染当前选中的区域内容
  const renderContent = () => {
    switch (activeSection) {
      case 'my-tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">我的督办</h2>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                添加督办任务
              </button>
            </div>
            
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask} 
              canEdit={true} 
            />
          </div>
        );
        
      case 'reports':
        return <ReportSection 
                 tasks={tasks} 
                 reports={reports} 
                 onAddReport={handleAddReport}
                 onEditReport={handleEditReport}
                 onDeleteReport={handleDeleteReport}
               />;
        
      case 'reminders':
        return <ReminderSection tasks={tasks} reports={reports} onAddReport={handleAddReport} />;
        
      case 'delays':
         return <DelaySection 
                   tasks={tasks} 
                   onUpdateDeadline={handleUpdateDeadline} 
                   onDeleteTask={handleDeleteTask} 
                 />;
        
      default:
        return <div>请选择左侧菜单</div>;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 左侧导航 */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </div>
      
      {/* 添加/编辑任务表单 */}
      <TaskForm 
        isOpen={showTaskForm} 
        onClose={() => setShowTaskForm(false)}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialTask={editingTask}
      />
    </div>
  );
}