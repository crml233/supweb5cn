import { useState } from 'react';
import { SupervisionReport, SupervisionTask } from '@/mocks/supervisionData';

interface ReportSectionProps {
  tasks: SupervisionTask[];
  reports: SupervisionReport[];
  onAddReport: (taskId: string, reportContent: string) => void;
  onEditReport: (reportId: string, reportContent: string) => void;
  onDeleteReport: (reportId: string) => void;
}

export default function ReportSection({ tasks, reports, onAddReport, onEditReport, onDeleteReport }: ReportSectionProps) {
  const [selectedTask, setSelectedTask] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  // 获取当前月份
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // 按月份分组报告
  const reportsByMonth = reports.reduce((groups, report) => {
    const month = report.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(report);
    return groups;
  }, {} as Record<string, SupervisionReport[]>);
  
  // 获取任务名称
  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.taskName : '未知任务';
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !reportContent.trim()) return;
  
  const handleEditReport = (report: SupervisionReport) => {
    setEditingReportId(report.id);
    setEditedContent(report.reportContent);
  };
  
  const handleSaveEdit = (e: React.FormEvent, reportId: string) => {
    e.preventDefault();
    if (!editedContent.trim()) return;
    
    onEditReport(reportId, editedContent);
    setEditingReportId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingReportId(null);
  };
  
  const handleDeleteReport = (reportId: string) => {
    onDeleteReport(reportId);
  };
    
    onAddReport(selectedTask, reportContent);
    setReportContent('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">督办报告管理</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? '收起表单' : '添加督办报告'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">添加督办报告</h3>
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择任务
              </label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- 选择任务 --</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.taskName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                报告月份
              </label>
              <input
                type="month"
                value={currentMonth}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                督办报告内容
              </label>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入本月督办情况..."
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                提交报告
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">历史督办报告</h3>
        {Object.keys(reportsByMonth).length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
            <i className="fas fa-file-alt text-4xl mb-3 opacity-30"></i>
            <p>暂无督办报告记录</p>
          </div>
        ) : (
          Object.entries(reportsByMonth).map(([month, reports]) => (
            <div key={month} className="mb-8">
              <h4 className="text-md font-semibold text-gray-700 mb-3">{month}月报告</h4>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                       任务名称
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">
                       报告内容
                     </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        操作
                     </th>
                   </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map(report => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getTaskName(report.taskId)}</div>
                        </td>
                         <td className="px-6 py-4 w-64">
                           <div className="text-sm text-gray-500 max-h-20 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                             {report.reportContent}
                           </div>
                         </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                           <div className="flex space-x-3 justify-end items-center">
                             <button
                               onClick={() => onEditReport(report.id, report.reportContent)}
                               className="text-blue-600 hover:text-blue-900 text-sm"

                             >
                               编辑
                             </button>
                             <button
                               onClick={() => onDeleteReport(report.id)}
                               className="text-red-600 hover:text-red-900 text-sm"

                             >
                               删除
                             </button>
                           </div>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
