'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// Fetch stats from API
async function fetchStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for development
    return {
      totalContacts: 1234,
      totalLeads: 89,
      activeDeals: 56,
      closedDeals: 23,
      totalRevenue: 125000,
      conversionRate: 12.5,
      avgDealSize: 2232,
      ticketsOpen: 15,
      ticketsClosed: 45,
      responseTime: '2.5h',
    };
  }
}

export default function OverviewStats({ initialStats }) {
  const [timeRange, setTimeRange] = useState('month');
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', timeRange],
    queryFn: fetchStats,
    initialData: initialStats,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading && !initialStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-4 text-center py-8 text-red-600">
          Failed to load statistics
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats?.totalContacts || 0,
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'blue',
    },
    {
      title: 'Active Leads',
      value: stats?.totalLeads || 0,
      change: '+8%',
      changeType: 'increase',
      icon: TrendingUpIcon,
      color: 'green',
    },
    {
      title: 'Pipeline Value',
      value: `$${((stats?.totalRevenue || 0) / 1000).toFixed(0)}k`,
      change: '+23%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'yellow',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      change: '-2%',
      changeType: 'decrease',
      icon: TargetIcon,
      color: 'purple',
    },
  ];

  return (
    <>
      {/* Time Range Selector */}
      <div className="flex justify-end mb-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 3 months</option>
          <option value="year">Last 12 months</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <MetricCard
          title="Average Deal Size"
          value={`$${(stats?.avgDealSize || 0).toLocaleString()}`}
          subtitle="Based on closed deals"
          icon={CalculatorIcon}
        />
        <MetricCard
          title="Open Tickets"
          value={stats?.ticketsOpen || 0}
          subtitle={`${stats?.ticketsClosed || 0} closed this month`}
          icon={TicketIcon}
        />
        <MetricCard
          title="Avg Response Time"
          value={stats?.responseTime || 'N/A'}
          subtitle="For support tickets"
          icon={ClockIcon}
        />
      </div>
    </>
  );
}

// Individual stat card component
function StatCard({ title, value, change, changeType, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === 'increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {changeType === 'increase' ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="ml-1">{change}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric card for additional stats
function MetricCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {title}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="ml-5 w-0 flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components
const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const TargetIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CalculatorIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const TicketIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);