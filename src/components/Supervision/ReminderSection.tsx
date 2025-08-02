import { useState } from 'react';
import { SupervisionReport, SupervisionTask } from '@/mocks/supervisionData';

interface ReminderSectionProps {
  tasks: SupervisionTask[];
  reports: SupervisionReport[];
  onAddReport: (taskId: string, reportContent: string) => void;
}

export default function ReminderSection({ tasks, reports, onAddReport }: ReminderSectionProps) {
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState('');
  
  // 获取当前月份
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const currentDay = currentDate.getDate();
  
  // 获取本月需要督办的任务
  const getMonthlyTasks = () => {
    return tasks.filter(task => {
      // 只包含未完成的任务
      if (task.status === 'completed') return false;
      
      // 检查本月是否已提交报告
      const hasReported = reports.some(
        report => report.taskId === task.id && report.month === currentMonth
      );
      
      // 如果已过督办日期且未提交报告，或者今天是督办日期
      return (!hasReported && task.monthlyDate <= currentDay) || task.monthlyDate === currentDay;
    });
  };
  
  // 检查任务是否已提交本月报告
  const hasMonthlyReport = (taskId: string) => {
    return reports.some(
      report => report.taskId === taskId && report.month === currentMonth
    );
  };
  
  const handleStartEditing = (taskId: string) => {
    setEditingReportId(taskId);
    setReportContent('');
  };
  
  const handleSubmitReport = (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    if (!reportContent.trim()) return;
    
    onAddReport(taskId, reportContent);
    setEditingReportId(null);
    setReportContent('');
  };
  
  const monthlyTasks = getMonthlyTasks();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">催办管理</h2>
        <p className="text-gray-500 mt-1">本月需督办任务清单（{currentMonth}）</p>
      </div>
      
      {monthlyTasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
          <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
          <h3 className="text-lg font-medium text-gray-900">本月所有督办任务已完成</h3>
          <p className="text-gray-500 mt-1">暂无需要催办的任务</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  任务名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  承办部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  督办日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyTasks.map(task => {
                const reported = hasMonthlyReport(task.id);
                const isEditing = editingReportId === task.id;
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.taskName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.monthlyDate}日</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reported 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reported ? '已督办' : '待督办'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {reported ? (
                        <span className="text-gray-500">已完成</span>
                      ) : isEditing ? (
                        <form onSubmit={(e) => handleSubmitReport(e, task.id)} className="inline-flex space-x-2">
                          <textarea
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            placeholder="输入督办报告..."
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 h-20"
                            required
                          ></textarea>
                          <div>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 block mb-2"
                            >
                              提交
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingReportId(null)}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 block"
                            >
                              取消
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => handleStartEditing(task.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          记录督办
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
