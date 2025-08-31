import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import OverviewStats from '@/components/dashboard/overview-stats';
import RecentActivities from '@/components/dashboard/recent-activities';
import PipelineOverview from '@/components/dashboard/pipeline-overview';
import UpcomingTasks from '@/components/dashboard/upcoming-tasks';
import RecentLeads from '@/components/dashboard/recent-leads';

// Server-side data fetching functions
async function getDashboardStats() {
  try {
    // In production, fetch from your API
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`);
    // return response.json();
    
    // Mock data for development
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
      weeklyGrowth: {
        contacts: 8.2,
        leads: 15.6,
        deals: -2.4,
        revenue: 23.8,
      },
      monthlyTargets: {
        revenue: 200000,
        deals: 75,
        leads: 150,
      },
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}

async function getQuickMetrics() {
  try {
    // Mock quick metrics for today
    return {
      todaysCalls: 12,
      todaysEmails: 24,
      todaysMeetings: 3,
      todaysDeals: 2,
      overdueActivities: 5,
      hotLeads: 8,
    };
  } catch (error) {
    console.error('Failed to fetch quick metrics:', error);
    return null;
  }
}

// Main Dashboard Page Component
export default async function DashboardPage() {
  // Fetch initial data on server
  const [stats, quickMetrics] = await Promise.all([
    getDashboardStats(),
    getQuickMetrics(),
  ]);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your CRM today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <QuickActionButtons />
          </div>
        </div>

        {/* Quick Metrics Banner */}
        {quickMetrics && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <QuickMetricCard
              title="Today's Calls"
              value={quickMetrics.todaysCalls}
              icon={PhoneIcon}
              color="green"
            />
            <QuickMetricCard
              title="Emails Sent"
              value={quickMetrics.todaysEmails}
              icon={MailIcon}
              color="blue"
            />
            <QuickMetricCard
              title="Meetings"
              value={quickMetrics.todaysMeetings}
              icon={CalendarIcon}
              color="purple"
            />
            <QuickMetricCard
              title="New Deals"
              value={quickMetrics.todaysDeals}
              icon={CurrencyDollarIcon}
              color="yellow"
            />
            <QuickMetricCard
              title="Overdue"
              value={quickMetrics.overdueActivities}
              icon={ExclamationTriangleIcon}
              color="red"
            />
            <QuickMetricCard
              title="Hot Leads"
              value={quickMetrics.hotLeads}
              icon={FireIcon}
              color="orange"
            />
          </div>
        )}

        {/* Main Stats Overview */}
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <OverviewStats initialStats={stats} />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Pipeline Overview - Takes up 4 columns */}
          <div className="col-span-full lg:col-span-4">
            <Suspense fallback={<PipelineLoadingSkeleton />}>
              <PipelineOverview />
            </Suspense>
          </div>
          
          {/* Recent Activities - Takes up 3 columns */}
          <div className="col-span-full lg:col-span-3">
            <Suspense fallback={<ActivitiesLoadingSkeleton />}>
              <RecentActivities />
            </Suspense>
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Upcoming Tasks - Takes up 3 columns */}
          <div className="col-span-full lg:col-span-3">
            <Suspense fallback={<TasksLoadingSkeleton />}>
              <UpcomingTasks />
            </Suspense>
          </div>
          
          {/* Recent Leads - Takes up 4 columns */}
          <div className="col-span-full lg:col-span-4">
            <Suspense fallback={<LeadsLoadingSkeleton />}>
              <RecentLeads />
            </Suspense>
          </div>
        </div>

        {/* Performance Insights Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceInsights stats={stats} />
          <RecentIntegrations />
        </div>

        {/* Quick Actions Panel */}
        <QuickActionsPanel />
      </div>
    </DashboardLayout>
  );
}

// Quick Action Buttons Component
function QuickActionButtons() {
  return (
    <div className="flex items-center space-x-2">
      <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Contact
      </button>
      <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        <PlusIcon className="h-4 w-4 mr-2" />
        New Deal
      </button>
    </div>
  );
}

// Quick Metric Card Component
function QuickMetricCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    yellow: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    red: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    orange: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// Performance Insights Component
function PerformanceInsights({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Performance Insights
      </h3>
      <div className="space-y-4">
        <InsightItem
          title="Revenue Target"
          current={stats.totalRevenue}
          target={stats.monthlyTargets?.revenue || 200000}
          format="currency"
        />
        <InsightItem
          title="Deals Target"
          current={stats.activeDeals + stats.closedDeals}
          target={stats.monthlyTargets?.deals || 75}
          format="number"
        />
        <InsightItem
          title="Leads Target"
          current={stats.totalLeads}
          target={stats.monthlyTargets?.leads || 150}
          format="number"
        />
      </div>
    </div>
  );
}

// Insight Item Component
function InsightItem({ title, current, target, format }) {
  const percentage = Math.round((current / target) * 100);
  const isOnTrack = percentage >= 70;

  const formatValue = (value) => {
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">{title}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatValue(current)} / {formatValue(target)}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isOnTrack ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs font-medium ${
          isOnTrack ? 'text-green-600 dark:text-green-400' : 
          percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 
          'text-red-600 dark:text-red-400'
        }`}>
          {percentage}% Complete
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isOnTrack ? 'On track' : 'Behind target'}
        </span>
      </div>
    </div>
  );
}

// Recent Integrations Component
function RecentIntegrations() {
  const integrations = [
    { name: 'WhatsApp Business', status: 'connected', lastSync: '2 minutes ago' },
    { name: 'Google Workspace', status: 'connected', lastSync: '1 hour ago' },
    { name: 'Twilio Voice', status: 'connected', lastSync: '3 hours ago' },
    { name: 'Zapier', status: 'error', lastSync: '1 day ago' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Integration Status
      </h3>
      <div className="space-y-3">
        {integrations.map((integration, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  integration.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {integration.name}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {integration.lastSync}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Actions Panel Component
function QuickActionsPanel() {
  const quickActions = [
    { title: 'Import Contacts', description: 'Upload CSV or sync from integrations', icon: UploadIcon },
    { title: 'Schedule Meeting', description: 'Book calendar appointments', icon: CalendarIcon },
    { title: 'Send Campaign', description: 'Email or WhatsApp campaigns', icon: MailIcon },
    { title: 'Generate Report', description: 'Create performance reports', icon: ChartBarIcon },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <action.icon className="h-6 w-6 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {action.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {action.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Loading Skeletons
function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="ml-5 space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivitiesLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TasksLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadsLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icon Components
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

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const FireIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Metadata for SEO
export const metadata = {
  title: 'Dashboard - CRM',
  description: 'Comprehensive CRM dashboard with stats, pipeline, activities, and insights',
};