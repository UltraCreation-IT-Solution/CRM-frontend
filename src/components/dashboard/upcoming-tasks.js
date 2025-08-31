'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatDistanceToNow, isToday, isTomorrow, isThisWeek } from 'date-fns';

// Fetch upcoming tasks from API
async function fetchUpcomingTasks() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/upcoming/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for development
    return [
      {
        id: 1,
        title: 'Follow up with John Smith',
        description: 'Call to discuss proposal feedback',
        type: 'call',
        priority: 'high',
        dueDate: new Date(),
        completed: false,
        contact: { name: 'John Smith', company: 'Acme Corp' },
        deal: { title: 'Website Redesign', value: 15000 },
        assignedTo: { name: 'You', avatar: '/avatars/you.jpg' },
      },
      {
        id: 2,
        title: 'Send contract to Maria Garcia',
        description: 'Email final contract for mobile app project',
        type: 'email',
        priority: 'high',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
        completed: false,
        contact: { name: 'Maria Garcia', company: 'TechStart Inc' },
        deal: { title: 'Mobile App', value: 25000 },
        assignedTo: { name: 'You', avatar: '/avatars/you.jpg' },
      },
      {
        id: 3,
        title: 'Product demo meeting',
        description: 'Demonstrate CRM features to potential client',
        type: 'meeting',
        priority: 'medium',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
        completed: false,
        contact: { name: 'Carlos Rodriguez', company: 'Global Solutions' },
        deal: { title: 'CRM System', value: 45000 },
        assignedTo: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
      },
      {
        id: 4,
        title: 'Prepare quarterly report',
        description: 'Compile Q4 sales metrics and analysis',
        type: 'task',
        priority: 'medium',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days
        completed: false,
        assignedTo: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      },
      {
        id: 5,
        title: 'WhatsApp check-in with Jennifer',
        description: 'Send project status update via WhatsApp',
        type: 'whatsapp',
        priority: 'low',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days
        completed: false,
        contact: { name: 'Jennifer Adams', company: 'Design Studio' },
        assignedTo: { name: 'Lisa Chen', avatar: '/avatars/lisa.jpg' },
      },
      {
        id: 6,
        title: 'Invoice review completed',
        description: 'Reviewed and approved monthly invoices',
        type: 'task',
        priority: 'low',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        completed: true,
        assignedTo: { name: 'You', avatar: '/avatars/you.jpg' },
      },
    ];
  }
}

// Update task completion status
async function updateTaskStatus(taskId, completed) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
    },
    body: JSON.stringify({ completed }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  
  return response.json();
}

export default function UpcomingTasks() {
  const [filter, setFilter] = useState('pending');
  const queryClient = useQueryClient();
  
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['upcoming-tasks'],
    queryFn: fetchUpcomingTasks,
    refetchInterval: 60000, // Refresh every minute
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }) => updateTaskStatus(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries(['upcoming-tasks']);
    },
  });

  const handleTaskToggle = (taskId, completed) => {
    updateTaskMutation.mutate({ taskId, completed });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Upcoming Tasks
          </h3>
          <div className="text-center py-8 text-red-600">
            Failed to load tasks
          </div>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks?.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return !task.completed && new Date(task.dueDate) < new Date();
      case 'today':
        return !task.completed && isToday(new Date(task.dueDate));
      default:
        return true;
    }
  }) || [];

  const taskCounts = {
    pending: tasks?.filter(t => !t.completed).length || 0,
    completed: tasks?.filter(t => t.completed).length || 0,
    overdue: tasks?.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length || 0,
    today: tasks?.filter(t => !t.completed && isToday(new Date(t.dueDate))).length || 0,
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Upcoming Tasks
          </h3>
          <button className="text-sm text-primary hover:text-primary/80">
            View All
          </button>
        </div>

        {/* Task Filter Tabs */}
        <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {[
            { key: 'pending', label: 'Pending', count: taskCounts.pending },
            { key: 'today', label: 'Today', count: taskCounts.today },
            { key: 'overdue', label: 'Overdue', count: taskCounts.overdue },
            { key: 'completed', label: 'Done', count: taskCounts.completed },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  tab.key === 'overdue' && tab.count > 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tasks found
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={handleTaskToggle}
                isUpdating={updateTaskMutation.isLoading}
              />
            ))
          )}
        </div>

        {/* Quick Add Task */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add new task
          </button>
        </div>
      </div>
    </div>
  );
}

// Individual task item component
function TaskItem({ task, onToggle, isUpdating }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call':
        return PhoneIcon;
      case 'email':
        return MailIcon;
      case 'meeting':
        return CalendarIcon;
      case 'whatsapp':
        return WhatsAppIcon;
      case 'task':
      default:
        return DocumentIcon;
    }
  };

  const getTimeIndicator = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    
    if (date < now) {
      return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    } else if (isToday(date)) {
      return { text: 'Today', color: 'text-blue-600 dark:text-blue-400' };
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'text-yellow-600 dark:text-yellow-400' };
    } else if (isThisWeek(date)) {
      return { text: 'This week', color: 'text-gray-600 dark:text-gray-400' };
    } else {
      return { 
        text: formatDistanceToNow(date, { addSuffix: true }), 
        color: 'text-gray-500 dark:text-gray-400' 
      };
    }
  };

  const TaskIcon = getTaskIcon(task.type);
  const timeIndicator = getTimeIndicator(task.dueDate);

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
      task.completed 
        ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-75' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-sm'
    }`}>
      <div className="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          disabled={isUpdating}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
      </div>
      
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(task.priority)}`}>
          <TaskIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${
            task.completed 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h4>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {task.contact && (
              <span>{task.contact.name} • {task.contact.company}</span>
            )}
            {task.deal && (
              <span className="text-green-600 dark:text-green-400">
                ${task.deal.value.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${timeIndicator.color}`}>
              {timeIndicator.text}
            </span>
            <img
              className="h-5 w-5 rounded-full"
              src={task.assignedTo.avatar || '/default-avatar.png'}
              alt={task.assignedTo.name}
              title={task.assignedTo.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function TaskSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex-shrink-0 pt-1">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Icon components
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.749" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);