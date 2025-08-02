// 督办任务类型定义
export interface SupervisionTask {
  id: string;
  taskName: string;
  department: string;
  deadline: string;
  originalDeadline?: string; // 原始截止日期
  monthlyDate: number;
  status: 'pending' | 'completed' | 'delayed';
  createdAt: string;
  remarks?: string; // 备注信息
}

// 督办报告类型定义
export interface SupervisionReport {
  id: string;
  taskId: string;
  month: string;
  reportContent: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

// 模拟督办任务数据
export const mockTasks: SupervisionTask[] = [
  {
    id: '1',
     taskName: '网站改版项目',
     department: '技术部',
     deadline: '2025-12-31',
     monthlyDate: 15,
     status: 'pending',
     createdAt: '2025-07-01',
     remarks: '需要完成首页设计、产品列表页重构和用户中心优化，注意响应式适配移动端'
   },
  {
    id: '2',
     taskName: '年度预算编制',
     department: '财务部',
     deadline: '2025-11-15',
     monthlyDate: 10,
     status: 'pending',
     createdAt: '2025-07-05',
     remarks: '需参考上年度支出情况，各部门预算需在10月20日前提交汇总'
   },
  {
    id: '3',
    taskName: '新产品市场调研',
    department: '市场部',
    deadline: '2025-09-30',
    monthlyDate: 5,
    status: 'completed',
    createdAt: '2025-06-20'
  }
];

// 模拟督办报告数据
export const mockReports: SupervisionReport[] = [
  {
    id: '1',
    taskId: '1',
    month: '2025-07',
    reportContent: '项目按计划进行，已完成需求分析',
    status: 'completed',
    createdAt: '2025-07-15'
  },
  {
    id: '2',
    taskId: '2',
    month: '2025-07',
    reportContent: '预算初稿已完成，等待审核',
    status: 'completed',
    createdAt: '2025-07-10'
  }
];
