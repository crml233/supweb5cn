import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'my-tasks', label: '我的督办', icon: 'fa-tasks' },
    { id: 'reports', label: '督办报告', icon: 'fa-file-alt' },
    { id: 'reminders', label: '催办管理', icon: 'fa-bell' },
    { id: 'delays', label: '延期管理', icon: 'fa-clock' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">督办项目管理</h2>
      </div>
      <nav className="p-2">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors",
                  activeSection === item.id 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
              <i className={`fa-solid ${item.icon} mr-3`}></i>
              {item.label}
            </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
