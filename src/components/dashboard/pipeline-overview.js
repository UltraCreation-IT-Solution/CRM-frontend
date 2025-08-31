'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Fetch pipeline data from API
async function fetchPipelineData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/pipeline/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pipeline data');
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for development
    return {
      stages: [
        {
          id: 'lead',
          name: 'Lead',
          color: '#3b82f6',
          deals: [
            {
              id: 1,
              title: 'Acme Corp - Website Redesign',
              value: 15000,
              company: 'Acme Corp',
              contact: 'John Smith',
              probability: 20,
              expectedCloseDate: '2024-01-15',
              lastActivity: '2024-01-05',
            },
            {
              id: 2,
              title: 'TechStart - Mobile App',
              value: 25000,
              company: 'TechStart Inc',
              contact: 'Maria Garcia',
              probability: 30,
              expectedCloseDate: '2024-01-20',
              lastActivity: '2024-01-03',
            },
          ],
        },
        {
          id: 'qualified',
          name: 'Qualified',
          color: '#10b981',
          deals: [
            {
              id: 3,
              title: 'Global Solutions - CRM System',
              value: 45000,
              company: 'Global Solutions',
              contact: 'Carlos Rodriguez',
              probability: 50,
              expectedCloseDate: '2024-01-25',
              lastActivity: '2024-01-04',
            },
          ],
        },
        {
          id: 'proposal',
          name: 'Proposal',
          color: '#f59e0b',
          deals: [
            {
              id: 4,
              title: 'Design Studio - Brand Identity',
              value: 8000,
              company: 'Design Studio',
              contact: 'Jennifer Adams',
              probability: 70,
              expectedCloseDate: '2024-01-18',
              lastActivity: '2024-01-06',
            },
            {
              id: 5,
              title: 'Enterprise Corp - Software License',
              value: 60000,
              company: 'Enterprise Corp',
              contact: 'Robert Kim',
              probability: 75,
              expectedCloseDate: '2024-01-30',
              lastActivity: '2024-01-07',
            },
          ],
        },
        {
          id: 'negotiation',
          name: 'Negotiation',
          color: '#8b5cf6',
          deals: [
            {
              id: 6,
              title: 'Manufacturing Inc - ERP Integration',
              value: 35000,
              company: 'Manufacturing Inc',
              contact: 'Lisa Park',
              probability: 85,
              expectedCloseDate: '2024-01-12',
              lastActivity: '2024-01-08',
            },
          ],
        },
        {
          id: 'closed-won',
          name: 'Closed Won',
          color: '#059669',
          deals: [
            {
              id: 7,
              title: 'StartupXYZ - Marketing Platform',
              value: 18000,
              company: 'StartupXYZ',
              contact: 'Alex Chen',
              probability: 100,
              expectedCloseDate: '2024-01-02',
              lastActivity: '2024-01-02',
            },
          ],
        },
      ],
    };
  }
}

export default function PipelineOverview() {
  const [selectedPipeline, setSelectedPipeline] = useState('sales');
  const [activeId, setActiveId] = useState(null);
  
  const { data: pipelineData, isLoading, error } = useQuery({
    queryKey: ['pipeline-data', selectedPipeline],
    queryFn: fetchPipelineData,
    refetchInterval: 60000, // Refresh every minute
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      // Handle deal movement between stages
      // This would typically trigger an API call to update the deal stage
      console.log(`Moving deal ${active.id} to stage ${over.id}`);
    }
    
    setActiveId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Pipeline Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <PipelineStageSkeleton key={i} />
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
            Pipeline Overview
          </h3>
          <div className="text-center py-8 text-red-600">
            Failed to load pipeline data
          </div>
        </div>
      </div>
    );
  }

  const totalValue = pipelineData?.stages?.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0);
  }, 0) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Pipeline Overview
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Value: <span className="font-semibold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString()}
              </span>
            </div>
            <select
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="sales">Sales Pipeline</option>
              <option value="support">Support Pipeline</option>
              <option value="marketing">Marketing Pipeline</option>
            </select>
          </div>
        </div>

        <DndContext 
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineData?.stages?.map((stage) => (
              <PipelineStage key={stage.id} stage={stage} />
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <DealCard 
                deal={pipelineData?.stages
                  ?.find(stage => stage.deals.find(deal => deal.id === activeId))
                  ?.deals.find(deal => deal.id === activeId)
                } 
                isDragging 
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Pipeline Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Deals
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {pipelineData?.stages?.reduce((sum, stage) => sum + stage.deals.length, 0) || 0}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Weighted Pipeline
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${((pipelineData?.stages?.reduce((sum, stage) => {
                return sum + stage.deals.reduce((stageSum, deal) => 
                  stageSum + (deal.value * deal.probability / 100), 0);
              }, 0) || 0) / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg Deal Size
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${Math.round(totalValue / (pipelineData?.stages?.reduce((sum, stage) => sum + stage.deals.length, 0) || 1)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pipeline stage component
function PipelineStage({ stage }) {
  const stageValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0);
  
  return (
    <SortableContext items={stage.deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: stage.color }}
            />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {stage.name}
            </h4>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {stage.deals.length}
          </div>
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          ${stageValue.toLocaleString()}
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {stage.deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          
          {stage.deals.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
              No deals in this stage
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  );
}

// Individual deal card component
function DealCard({ deal, isDragging = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!deal) return null;

  const isOverdue = new Date(deal.expectedCloseDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`pipeline-stage bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer transition-all ${
        isDragging ? 'shadow-lg scale-105 rotate-2' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {deal.title}
        </h5>
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {deal.probability}%
        </div>
      </div>
      
      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        ${deal.value.toLocaleString()}
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
        {deal.company} • {deal.contact}
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`text-xs px-2 py-1 rounded ${
          isOverdue 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {new Date(deal.expectedCloseDate).toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.floor((new Date() - new Date(deal.lastActivity)) / (1000 * 60 * 60 * 24))}d
          </span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for pipeline stage
function PipelineStageSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20" />
        </div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-6" />
      </div>
      
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16 mb-4" />

      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Icon component
const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);