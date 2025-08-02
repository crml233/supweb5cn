import { Link } from 'react-router-dom';
import { Home as HomeIcon, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <HomeIcon className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">欢迎使用督办任务系统</h1>
            <p className="mt-2 text-gray-600">高效管理和跟踪您的督办任务</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link 
              to="/supervision" 
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              进入督办仪表板
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}