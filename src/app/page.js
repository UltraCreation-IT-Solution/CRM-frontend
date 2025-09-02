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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: 'Contact Management',
      description: 'Organize and manage all your customer relationships in one place',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Deal Pipeline',
      description: 'Track opportunities and close more deals with visual pipeline management',
      icon: '💼',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Analytics & Reports',
      description: 'Get insights with powerful analytics and customizable reports',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Task Automation',
      description: 'Automate routine tasks and focus on what matters most',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers', icon: '😊' },
    { number: '50K+', label: 'Contacts Managed', icon: '📱' },
    { number: '99.9%', label: 'Uptime', icon: '🚀' },
    { number: '24/7', label: 'Support', icon: '💬' },
  ];

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900'>
      {/* Navigation */}
      <nav className='relative z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'>
                <span className='text-lg font-bold text-white'>CRM</span>
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>CRM Pro</span>
            </div>

            <div className='flex items-center space-x-4'>
              <Link
                href='/dashboard/overview'
                className='transform rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            {/* Left Content */}
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            >
              <div className='space-y-4'>
                <h1 className='bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-5xl font-bold leading-tight text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 lg:text-6xl'>
                  Transform Your
                  <span className='block'>Customer Relations</span>
                </h1>
                <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
                  Streamline your sales process, manage contacts, and grow your business with our
                  powerful CRM solution.
                </p>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='/dashboard/overview'
                  className='inline-flex transform items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
                >
                  Get Started
                  <svg
                    className='ml-2 h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                    />
                  </svg>
                </Link>
                <button className='inline-flex items-center justify-center rounded-full border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'>
                  Watch Demo
                  <svg
                    className='ml-2 h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z'
                    />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-2 gap-4 pt-8 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <div className='mb-1 text-2xl'>{stat.icon}</div>
                    <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {stat.number}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Animated Feature Card */}
            <div
              className={`transition-all delay-300 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
              <div className='relative'>
                {/* Animated Background */}
                <div className='absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-3xl'></div>

                {/* Feature Card */}
                <div className='relative rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-lg dark:border-gray-700/20 dark:bg-gray-800/90'>
                  <div className='space-y-6 text-center'>
                    <div
                      className={`transform text-6xl transition-all duration-500 ${currentFeature !== undefined ? 'scale-100' : 'scale-95'}`}
                    >
                      {features[currentFeature]?.icon}
                    </div>

                    <div className='space-y-3'>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {features[currentFeature]?.title}
                      </h3>
                      <p className='text-gray-600 dark:text-gray-300'>
                        {features[currentFeature]?.description}
                      </p>
                    </div>

                    {/* Feature Navigation Dots */}
                    <div className='flex justify-center space-x-2'>
                      {features.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentFeature(index)}
                          className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            currentFeature === index
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className='absolute -right-4 -top-4 h-20 w-20 animate-bounce rounded-full bg-gradient-to-r from-pink-400 to-red-400 opacity-60'></div>
                <div className='absolute -bottom-6 -left-6 h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-60'></div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className='absolute left-0 top-0 -z-10 h-full w-full overflow-hidden'>
          <div className='animate-blob absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter'></div>
          <div className='animate-blob animation-delay-2000 absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter'></div>
          <div className='animate-blob animation-delay-4000 absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter'></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='bg-white/50 py-20 dark:bg-gray-800/50'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
              Everything You Need to Succeed
            </h2>
            <p className='mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300'>
              Powerful features designed to help you manage customers, close deals, and grow your
              business.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`h-14 w-14 bg-gradient-to-r ${feature.color} mb-4 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className='text-2xl'>{feature.icon}</span>
                </div>
                <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-blue-500 to-purple-600 py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-6 text-4xl font-bold text-white'>Ready to Transform Your Business?</h2>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-blue-100'>
            Join thousands of businesses already using CRM Pro to streamline their operations and
            boost sales.
          </p>
          <Link
            href='/dashboard/overview'
            className='inline-flex transform items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl'
          >
            Start Your Journey
            <svg className='ml-2 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
