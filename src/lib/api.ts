// API服务，用于与Django后端通信
import { SupervisionReport, SupervisionTask, mockReports } from '@/mocks/supervisionData';

// Django后端API基础URL，实际使用时替换为你的Django服务器地址
const API_BASE_URL = 'http://localhost:8000/api';

// 督办任务相关API
export const supervisionAPI = {
  // 获取所有督办任务
  async getTasks(): Promise<SupervisionTask[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      //  fallback to mock data if API fails
      const savedTasks = localStorage.getItem('supervisionTasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
  },

  // 创建新督办任务
  async createTask(taskData: Omit<SupervisionTask, 'id' | 'createdAt'>): Promise<SupervisionTask> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      //  fallback to local creation if API fails
      const newTask: SupervisionTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const tasks = JSON.parse(localStorage.getItem('supervisionTasks') || '[]');
      tasks.push(newTask);
      localStorage.setItem('supervisionTasks', JSON.stringify(tasks));
      
      return newTask;
    }
  },

  // 更新督办任务
  async updateTask(taskId: string, taskData: Partial<SupervisionTask>): Promise<SupervisionTask> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      //  fallback to local update if API fails
      const tasks = JSON.parse(localStorage.getItem('supervisionTasks') || '[]');
      const updatedTasks = tasks.map((task: SupervisionTask) => 
        task.id === taskId ? { ...task, ...taskData } : task
      );
      
      localStorage.setItem('supervisionTasks', JSON.stringify(updatedTasks));
      return updatedTasks.find((task: SupervisionTask) => task.id === taskId) as SupervisionTask;
    }
  },

  // 删除督办任务
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      //  fallback to local deletion if API fails
      const tasks = JSON.parse(localStorage.getItem('supervisionTasks') || '[]');
      const filteredTasks = tasks.filter((task: SupervisionTask) => task.id !== taskId);
      localStorage.setItem('supervisionTasks', JSON.stringify(filteredTasks));
      
      return true;
    }
  },

  // 获取所有督办报告
  async getReports(): Promise<SupervisionReport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
       //  fallback to mock data if API fails
      const savedReports = localStorage.getItem('supervisionReports');
      if (savedReports) {
        return JSON.parse(savedReports);
      } else {
        // 首次使用时将mock数据保存到localStorage
        localStorage.setItem('supervisionReports', JSON.stringify(mockReports));
        return mockReports;
      }
    }
  },

  // 创建新督办报告
  async createReport(reportData: Omit<SupervisionReport, 'id' | 'createdAt'>): Promise<SupervisionReport> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) throw new Error('Failed to create report');
      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      //  fallback to local creation if API fails
      const newReport: SupervisionReport = {
        ...reportData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const reports = JSON.parse(localStorage.getItem('supervisionReports') || '[]');
      reports.push(newReport);
      localStorage.setItem('supervisionReports', JSON.stringify(reports));
       
      return newReport;
    }
  },

  // 更新督办报告
  async updateReport(reportId: string, reportData: Partial<SupervisionReport>): Promise<SupervisionReport> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) throw new Error('Failed to update report');
      return await response.json();
    } catch (error) {
      console.error('Error updating report:', error);
      //  fallback to local update if API fails
      const reports = JSON.parse(localStorage.getItem('supervisionReports') || '[]');
      const updatedReports = reports.map((report: SupervisionReport) => 
        report.id === reportId ? { ...report, ...reportData } : report
      );
      
      localStorage.setItem('supervisionReports', JSON.stringify(updatedReports));
      return updatedReports.find((report: SupervisionReport) => report.id === reportId) as SupervisionReport;
    }
  },
  
  // 删除督办报告
  async deleteReport(reportId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete report');
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      //  fallback to local deletion if API fails
      const reports = JSON.parse(localStorage.getItem('supervisionReports') || '[]');
      const filteredReports = reports.filter((report: SupervisionReport) => report.id !== reportId);
      localStorage.setItem('supervisionReports', JSON.stringify(filteredReports));
      
      return true;
    }
  }
};