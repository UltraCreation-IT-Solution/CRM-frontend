'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Fetch recent activities from API
async function fetchRecentActivities() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities/recent/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for development
    return [
      {
        id: 1,
        type: 'call',
        title: 'Called John Smith',
        description: 'Discussed new project requirements and timeline',
        contact: { name: 'John Smith', company: 'Acme Corp' },
        user: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        status: 'completed',
        duration: '25m',
      },
      {
        id: 2,
        type: 'email',
        title: 'Email sent to Maria Garcia',
        description: 'Proposal document sent for review',
        contact: { name: 'Maria Garcia', company: 'TechStart Inc' },
        user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        status: 'sent',
        attachments: 2,
      },
      {
        id: 3,
        type: 'meeting',
        title: 'Meeting with Development Team',
        description: 'Product roadmap discussion and sprint planning',
        contact: { name: 'Dev Team', company: 'Internal' },
        user: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'completed',
        attendees: 5,
      },
      {
        id: 4,
        type: 'whatsapp',
        title: 'WhatsApp message to Carlos Rodriguez',
        description: 'Follow-up on pricing inquiry',
        contact: { name: 'Carlos Rodriguez', company: 'Global Solutions' },
        user: { name: 'Lisa Chen', avatar: '/avatars/lisa.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        status: 'delivered',
      },
      {
        id: 5,
        type: 'task',
        title: 'Task completed: Prepare contract',
        description: 'Contract prepared and reviewed for new client',
        contact: { name: 'Jennifer Adams', company: 'Design Studio' },
        user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        status: 'completed',
      },
      {
        id: 6,
        type: 'deal',
        title: 'Deal moved to Negotiation',
        description: 'Enterprise software deal progressed in pipeline',
        contact: { name: 'Robert Kim', company: 'Enterprise Corp' },
        user: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        status: 'updated',
        value: 45000,
      },
    ];
  }
}

export default function RecentActivities() {
  const [filter, setFilter] = useState('all');
  
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recent-activities', filter],
    queryFn: fetchRecentActivities,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities', count: activities?.length || 0 },
    { value: 'call', label: 'Calls', count: activities?.filter(a => a.type === 'call').length || 0 },
    { value: 'email', label: 'Emails', count: activities?.filter(a => a.type === 'email').length || 0 },
    { value: 'meeting', label: 'Meetings', count: activities?.filter(a => a.type === 'meeting').length || 0 },
    { value: 'whatsapp', label: 'WhatsApp', count: activities?.filter(a => a.type === 'whatsapp').length || 0 },
  ];

  const filteredActivities = activities?.filter(activity => 
    filter === 'all' || activity.type === filter
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <ActivitySkeleton key={i} />
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
            Recent Activities
          </h3>
          <div className="text-center py-8 text-red-600">
            Failed to load activities
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Activities
          </h3>
          <button className="text-sm text-primary hover:text-primary/80">
            View All
          </button>
        </div>

        {/* Activity Type Filter */}
        <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === type.value
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {type.label} {type.count > 0 && `(${type.count})`}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="activity-timeline space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No activities found
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Individual activity item component
function ActivityItem({ activity }) {
  const getActivityIcon = (type) => {
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
        return CheckCircleIcon;
      case 'deal':
        return CurrencyDollarIcon;
      default:
        return DocumentIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'sent':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'delivered':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      case 'updated':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div className="activity-item relative">
      <div className="flex space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {activity.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {activity.description}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <img
                  className="h-5 w-5 rounded-full"
                  src={activity.user.avatar || '/default-avatar.png'}
                  alt={activity.user.name}
                />
                <span>{activity.user.name}</span>
              </div>
              <div>
                {activity.contact.name} • {activity.contact.company}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              {activity.duration && (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {activity.duration}
                </span>
              )}
              {activity.attachments && (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {activity.attachments} files
                </span>
              )}
              {activity.attendees && (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {activity.attendees} attendees
                </span>
              )}
              {activity.value && (
                <span className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                  ${activity.value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function ActivitySkeleton() {
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
}

// Icon components
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

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);