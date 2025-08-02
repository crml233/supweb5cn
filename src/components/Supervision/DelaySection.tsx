import { useState } from 'react';
import { SupervisionTask } from '@/mocks/supervisionData';

interface DelaySectionProps {
  tasks: SupervisionTask[];
  onUpdateDeadline: (taskId: string, newDeadline: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function DelaySection({ tasks, onUpdateDeadline, onDeleteTask }: DelaySectionProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newDeadline, setNewDeadline] = useState('');
  
  // 获取超期未完成的任务
   const getDelayedTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(task => {
    if (task.status === 'completed') return false;
    
    // 检查原完成时限是否超期（如果存在），否则检查当前完成时限
    const deadlineToCheck = task.originalDeadline || task.deadline;
    return deadlineToCheck < today;
  });
  };
  
  const handleStartEditing = (taskId: string, currentDeadline: string) => {
    setEditingTaskId(taskId);
    setNewDeadline(currentDeadline);
  };
  
  const handleSubmitNewDeadline = (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    if (!newDeadline) return;
    
    onUpdateDeadline(taskId, newDeadline);
    setEditingTaskId(null);
  };
  
  const delayedTasks = getDelayedTasks();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">延期管理</h2>
        <p className="text-gray-500 mt-1">超期未完成任务清单</p>
      </div>
      
      {delayedTasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
          <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
          <h3 className="text-lg font-medium text-gray-900">暂无超期任务</h3>
          <p className="text-gray-500 mt-1">所有任务均在有效期内</p>
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
                    原完成时限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    新完成时限
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
              {delayedTasks.map(task => {
                const isEditing = editingTaskId === task.id;
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.taskName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.department}</div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 line-through text-red-500">{task.originalDeadline || task.deadline}</div>
                      </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-500">{task.newDeadline || '-'}</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                         已延期
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {isEditing ? (
                         <form onSubmit={(e) => handleSubmitNewDeadline(e, task.id)} className="inline-flex space-x-2">
                           <input
                             type="date"
                             value={newDeadline}
                             onChange={(e) => setNewDeadline(e.target.value)}
                             className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                             required
                           />
                           <div>
                             <button
                               type="submit"
                               className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 block mb-2"
                             >
                               更新
                             </button>
                             <button
                               type="button"
                               onClick={() => setEditingTaskId(null)}
                               className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 block"
                             >
                               取消
                             </button>
                           </div>
                         </form>
                       ) : (
                         <div className="flex justify-end space-x-4">
                           <button
                             onClick={() => handleStartEditing(task.id, task.deadline)}
                             className="text-blue-600 hover:text-blue-900"
                           >
                             设置新时限
                           </button>
                           <button
                             onClick={() => onDeleteTask(task.id)}
                             className="text-red-600 hover:text-red-900"
                           >
                             删除
                           </button>
                         </div>
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
