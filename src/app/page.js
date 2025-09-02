// import { redirect } from 'next/navigation';
// import DashboardLayout from '@/components/dashboard/layout';
// import OverviewStats from '@/components/dashboard/overview-stats';
// import RecentActivities from '@/components/dashboard/recent-activities';
// import PipelineOverview from '@/components/dashboard/pipeline-overview';
// import UpcomingTasks from '@/components/dashboard/upcoming-tasks';
// import RecentLeads from '@/components/dashboard/recent-leads';

// // This is a Server Component by default in App Router
// export default async function HomePage() {
//   // In a real app, you would check authentication on the server side
//   // For now, we'll redirect to dashboard overview
//   redirect('/dashboard');
// }

// // Alternative: If you want this to be the actual dashboard
// export async function DashboardHomePage() {
//   // Server-side data fetching (optional)
//   const stats = await getInitialStats();
  
//   return (
//     <DashboardLayout>
//       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
//         <div className="flex items-center justify-between space-y-2">
//           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//         </div>
        
//         {/* Stats Overview */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <OverviewStats initialStats={stats} />
//         </div>
        
//         {/* Main Content Grid */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//           {/* Pipeline Overview */}
//           <div className="col-span-4">
//             <PipelineOverview />
//           </div>
          
//           {/* Recent Activities */}
//           <div className="col-span-3">
//             <RecentActivities />
//           </div>
//         </div>
        
//         {/* Secondary Content Grid */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//           {/* Upcoming Tasks */}
//           <div className="col-span-3">
//             <UpcomingTasks />
//           </div>
          
//           {/* Recent Leads */}
//           <div className="col-span-4">
//             <RecentLeads />
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// // Server-side data fetching function
// async function getInitialStats() {
//   try {
//     // In production, you would fetch from your API
//     // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`);
//     // return response.json();
    
//     // Mock data for development
//     return {
//       totalContacts: 1234,
//       totalLeads: 89,
//       totalDeals: 56,
//       totalRevenue: 125000,
//       conversionRate: 12.5,
//       avgDealSize: 2232,
//     };
//   } catch (error) {
//     console.error('Failed to fetch initial stats:', error);
//     return null;
//   }
// }

// // Metadata for SEO
// export const metadata = {
//   title: 'Dashboard - CRM',
//   description: 'CRM Dashboard with pipeline overview, recent activities, and key metrics',
// };


'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard overview
    router.push('/dashboard/overview');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Redirecting to CRM Dashboard...
        </p>
      </div>
    </div>
  );
}