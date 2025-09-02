'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCRM, useAuth } from '../providers';

// Icon components - MOVED TO TOP
const HomeIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    />
  </svg>
);

const UserPlusIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
    />
  </svg>
);

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 6h16M4 12h16M4 18h16'
    />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5a3 3 0 006 0z'
    />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
  </svg>
);

// Navigation items - NOW DEFINED AFTER ICONS
const navigation = [
  {
    name: 'Overview',
    href: '/dashboard/overview',
    icon: HomeIcon,
    current: false,
  },
  {
    name: 'Contacts',
    href: '/dashboard/contacts',
    icon: UsersIcon,
    current: false,
    badge: null,
  },
  {
    name: 'Leads',
    href: '/dashboard/leads',
    icon: UserPlusIcon,
    current: false,
    badge: 'new',
  },
  {
    name: 'Deals',
    href: '/dashboard/deals',
    icon: CurrencyDollarIcon,
    current: false,
  },
  {
    name: 'Activities',
    href: '/dashboard/activities',
    icon: ClockIcon,
    current: false,
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, notifications } = useCRM();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update navigation current state based on pathname
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href,
  }));

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Desktop sidebar */}
      <div
        className={`hidden transition-all duration-300 lg:flex lg:flex-shrink-0 ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-16'
        }`}
      >
        <div className='flex w-full flex-col'>
          <div className='crm-sidebar flex flex-grow flex-col overflow-y-auto pb-4 pt-5'>
            {/* Logo */}
            <div className='flex flex-shrink-0 items-center px-4'>
              <div className='flex items-center space-x-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
                  <span className='text-sm font-bold text-white'>CRM</span>
                </div>
                {sidebarOpen && (
                  <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                    CRM Dashboard
                  </span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className='mt-8 flex-1 space-y-1 px-2'>
              {updatedNavigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 flex-shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}
                  />
                  {sidebarOpen && (
                    <>
                      <span className='flex-1'>{item.name}</span>
                      {item.badge && (
                        <span
                          className={`ml-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            typeof item.badge === 'number'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </nav>

            {/* Sidebar toggle */}
            <div className='flex-shrink-0 px-2 pb-2'>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              >
                {sidebarOpen ? (
                  <ChevronLeftIcon className='h-5 w-5' />
                ) : (
                  <ChevronRightIcon className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className='fixed inset-0 z-40 flex'>
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-75'
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className='relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800'>
            {/* Mobile navigation content */}
            <div className='crm-sidebar flex flex-grow flex-col overflow-y-auto pb-4 pt-5'>
              <div className='flex flex-shrink-0 items-center px-4'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
                  <span className='text-sm font-bold text-white'>CRM</span>
                </div>
                <span className='ml-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  CRM Dashboard
                </span>
              </div>
              <nav className='mt-8 flex-1 space-y-1 px-2'>
                {updatedNavigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      item.current
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className='mr-3 h-6 w-6 flex-shrink-0' />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='crm-header relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
          <button
            className='border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden'
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className='h-6 w-6' />
          </button>

          <div className='flex flex-1 items-center justify-between px-4'>
            <div className='flex flex-1'>
              <div className='flex w-full lg:ml-0'>
                <label htmlFor='search' className='sr-only'>
                  Search
                </label>
                <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center'>
                    <SearchIcon className='h-5 w-5' />
                  </div>
                  <input
                    id='search'
                    className='block h-full w-full border-transparent bg-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400'
                    placeholder='Search contacts, deals, tickets...'
                    type='search'
                  />
                </div>
              </div>
            </div>

            <div className='ml-4 flex items-center space-x-4 md:ml-6'>
              {/* Notifications */}
              <button className='relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800'>
                <BellIcon className='h-6 w-6' />
                {notifications.length > 0 && (
                  <span className='absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className='relative'>
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                        {user?.name?.[0] || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className='hidden md:block'>
                    <div className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                      {user?.name}
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className='relative flex-1 overflow-y-auto focus:outline-none'>{children}</main>
      </div>
    </div>
  );
}
