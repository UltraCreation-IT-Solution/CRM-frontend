'use client';

import { useState, useEffect } from 'react';

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalLeads: 0, 
    totalDeals: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data (no backend needed)
    setTimeout(() => {
      setStats({
        totalContacts: 1234,
        totalLeads: 89,
        totalDeals: 45,
        totalRevenue: 125000,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back! Here's what's happening with your CRM today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts.toLocaleString()}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Active Leads" 
          value={stats.totalLeads.toLocaleString()}
          icon="🎯"
          color="bg-green-500"
        />
        <StatCard
          title="Open Deals"
          value={stats.totalDeals.toLocaleString()}
          icon="💼"
          color="bg-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          icon="💰"
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {[
              {
                action: "New lead created",
                user: "John Doe", 
                time: "5 minutes ago",
                type: "lead"
              },
              {
                action: "Deal closed",
                user: "Sarah Johnson",
                time: "2 hours ago",
                type: "deal"
              },
              {
                action: "Contact updated",
                user: "Mike Wilson", 
                time: "4 hours ago",
                type: "contact"
              },
              {
                action: "Email sent",
                user: "Lisa Brown",
                time: "6 hours ago",
                type: "email"
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'lead' ? 'bg-green-400' :
                  activity.type === 'deal' ? 'bg-blue-400' :
                  activity.type === 'contact' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
              <div className="text-2xl mb-2">➕</div>
              <div className="text-sm font-medium">Add Contact</div>
            </button>
            <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium">Create Lead</div>
            </button>
            <button className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors">
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-medium">New Deal</div>
            </button>
            <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">View Reports</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-lg p-3 text-white text-xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}