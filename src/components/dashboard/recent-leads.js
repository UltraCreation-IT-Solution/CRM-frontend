'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Fetch recent leads from API
async function fetchRecentLeads() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/recent/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for development
    return [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@newcompany.com',
        phone: '+1-555-0123',
        company: 'New Company Inc',
        title: 'Marketing Director',
        source: 'website',
        status: 'new',
        score: 85,
        value: 12000,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        assignedTo: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
        tags: ['hot', 'enterprise'],
        notes: 'Interested in comprehensive marketing automation solution',
      },
      {
        id: 2,
        name: 'David Chen',
        email: 'david.chen@startup.io',
        phone: '+1-555-0124',
        company: 'StartupIO',
        title: 'CTO',
        source: 'linkedin',
        status: 'contacted',
        score: 72,
        value: 8500,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        assignedTo: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
        tags: ['tech', 'startup'],
        notes: 'Looking for scalable CRM solution for growing team',
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        email: 'emma@consulting.com',
        phone: '+1-555-0125',
        company: 'Rodriguez Consulting',
        title: 'CEO',
        source: 'referral',
        status: 'qualified',
        score: 92,
        value: 25000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        assignedTo: { name: 'Lisa Chen', avatar: '/avatars/lisa.jpg' },
        tags: ['vip', 'consulting'],
        notes: 'Referred by existing client, ready to discuss proposal',
      },
      {
        id: 4,
        name: 'Michael Brown',
        email: 'mbrown@enterprise.corp',
        phone: '+1-555-0126',
        company: 'Enterprise Corp',
        title: 'Operations Manager',
        source: 'cold_email',
        status: 'nurturing',
        score: 45,
        value: 18000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        assignedTo: { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
        tags: ['enterprise', 'slow'],
        notes: 'Needs more time to evaluate, scheduled follow-up next week',
      },
      {
        id: 5,
        name: 'Sophie Taylor',
        email: 'sophie@agency.com',
        phone: '+1-555-0127',
        company: 'Creative Agency',
        title: 'Account Director',
        source: 'social_media',
        status: 'unqualified',
        score: 28,
        value: 3500,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        assignedTo: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
        tags: ['small', 'budget'],
        notes: 'Budget constraints, not a good fit for our premium solution',
      },
      {
        id: 6,
        name: 'James Wilson',
        email: 'james@retailstore.com',
        phone: '+1-555-0128',
        company: 'Retail Store Chain',
        title: 'IT Director',
        source: 'trade_show',
        status: 'converted',
        score: 95,
        value: 35000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        assignedTo: { name: 'Lisa Chen', avatar: '/avatars/lisa.jpg' },
        tags: ['won', 'retail'],
        notes: 'Successfully converted to deal, contract signed',
      },
    ];
  }
}

// Update lead status
async function updateLeadStatus(leadId, status) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/${leadId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update lead');
  }
  
  return response.json();
}

export default function RecentLeads() {
  const [filter, setFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const queryClient = useQueryClient();
  
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: fetchRecentLeads,
    refetchInterval: 60000, // Refresh every minute
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, status }) => updateLeadStatus(leadId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['recent-leads']);
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Leads
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <LeadSkeleton key={i} />
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
            Recent Leads
          </h3>
          <div className="text-center py-8 text-red-600">
            Failed to load leads
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'all', label: 'All Leads', count: leads?.length || 0 },
    { value: 'new', label: 'New', count: leads?.filter(l => l.status === 'new').length || 0 },
    { value: 'contacted', label: 'Contacted', count: leads?.filter(l => l.status === 'contacted').length || 0 },
    { value: 'qualified', label: 'Qualified', count: leads?.filter(l => l.status === 'qualified').length || 0 },
  ];

  const filteredLeads = leads?.filter(lead => 
    filter === 'all' || lead.status === filter
  ) || [];

  const handleStatusChange = (leadId, newStatus) => {
    updateLeadMutation.mutate({ leadId, status: newStatus });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Leads
          </h3>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-primary hover:text-primary/80">
              Import
            </button>
            <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90">
              Add Lead
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === option.value
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead} 
                    onStatusChange={handleStatusChange}
                    onSelect={() => setSelectedLead(lead)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No leads found
            </div>
          )}
        </div>

        {/* Lead Detail Modal/Panel would go here */}
        {selectedLead && (
          <LeadDetailPanel 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </div>
  );
}

// Individual lead row component
function LeadRow({ lead, onStatusChange, onSelect }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'nurturing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'unqualified':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'converted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'website':
        return GlobeIcon;
      case 'linkedin':
        return LinkedInIcon;
      case 'email':
        return MailIcon;
      case 'referral':
        return UserGroupIcon;
      case 'cold_email':
        return MailOpenIcon;
      case 'social_media':
        return HashtagIcon;
      case 'trade_show':
        return PresentationIcon;
      default:
        return QuestionMarkIcon;
    }
  };

  const SourceIcon = getSourceIcon(lead.source);

  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      onClick={onSelect}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {lead.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {lead.title} at {lead.company}
            </div>
            <div className="flex items-center mt-1">
              {lead.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <SourceIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white capitalize">
            {lead.source.replace('_', ' ')}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
            <div 
              className="bg-current h-2 rounded-full transition-all"
              style={{ 
                width: `${lead.score}%`,
                color: getScoreColor(lead.score) === 'text-green-600 dark:text-green-400' ? '#10b981' :
                       getScoreColor(lead.score) === 'text-yellow-600 dark:text-yellow-400' ? '#f59e0b' :
                       getScoreColor(lead.score) === 'text-orange-600 dark:text-orange-400' ? '#f97316' : '#ef4444'
              }}
            />
          </div>
          <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
            {lead.score}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        ${lead.value.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={lead.status}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(lead.id, e.target.value);
          }}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(lead.status)}`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="nurturing">Nurturing</option>
          <option value="unqualified">Unqualified</option>
          <option value="converted">Converted</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            className="h-6 w-6 rounded-full mr-2"
            src={lead.assignedTo.avatar || '/default-avatar.png'}
            alt={lead.assignedTo.name}
          />
          <span className="text-sm text-gray-900 dark:text-white">
            {lead.assignedTo.name}
          </span>
        </div>
      </td>
    </tr>
  );
}

// Lead detail panel component (simplified)
function LeadDetailPanel({ lead, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {lead.name}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <div className="text-sm text-gray-900 dark:text-white">{lead.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
              <div className="text-sm text-gray-900 dark:text-white">{lead.phone}</div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
            <div className="text-sm text-gray-900 dark:text-white mt-1">{lead.notes}</div>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
              Convert to Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function LeadSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
      </td>
    </tr>
  );
}

// Icon components
const GlobeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserGroupIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MailOpenIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12l-6.75-4.5M12 12l6.75-4.5" />
  </svg>
);

const HashtagIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const PresentationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H3a1 1 0 00-1 1v10a1 1 0 001 1h3l2 3 2-3h8a1 1 0 001-1V5a1 1 0 00-1-1z" />
  </svg>
);

const QuestionMarkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);