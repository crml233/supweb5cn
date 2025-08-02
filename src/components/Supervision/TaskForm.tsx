import { useState, useEffect } from 'react';
import { SupervisionTask } from '@/mocks/supervisionData';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<SupervisionTask, 'id' | 'createdAt'>) => void;
  initialTask?: SupervisionTask;
}

export default function TaskForm({ isOpen, onClose, onSubmit, initialTask }: TaskFormProps) {
  const [formData, setFormData] = useState({
    taskName: '',
    department: '',
    deadline: '',
    monthlyDate: 1,
    status: 'pending' as 'pending' | 'completed' | 'delayed',
    remarks: '' // 备注信息
  });

  useEffect(() => {
    if (initialTask) {
        setFormData({
          taskName: initialTask.taskName,
          department: initialTask.department,
          deadline: initialTask.deadline,
          monthlyDate: initialTask.monthlyDate,
          status: initialTask.status,
          remarks: initialTask.remarks || ''
        });
    } else {
        setFormData({
          taskName: '',
          department: '',
          deadline: '',
          monthlyDate: 1,
          status: 'pending',
          remarks: ''
        });
    }
  }, [isOpen, initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyDate' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {initialTask ? '编辑督办任务' : '添加督办任务'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              交办事项
            </label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              承办部室/子公司
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              完成时限
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              每月督办日期
            </label>
            <select
              name="monthlyDate"
              value={formData.monthlyDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}日</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              完成状态
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">未完成</option>
              <option value="completed">已完成</option>
              <option value="delayed">已延期</option>
            </select>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               备注信息
             </label>
             <textarea
               name="remarks"
               value={formData.remarks}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 overflow-y-auto"
               placeholder="请输入备注信息..."
             ></textarea>
           </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialTask ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
