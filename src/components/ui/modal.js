'use client';

import { createContext, useContext, useEffect, useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import Button from './button';

// Modal Context
const ModalContext = createContext();

// Modal Provider Component
export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (modalConfig) => {
    const id = Math.random().toString(36).substring(2, 9);
    setModals(prev => [...prev, { ...modalConfig, id }]);
    return id;
  };

  const closeModal = (id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
}

// Hook to use modal
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Modal Container that renders all active modals
function ModalContainer() {
  const { modals } = useContext(ModalContext) || { modals: [] };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div>
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          {...modal}
          zIndex={1000 + index * 10}
        />
      ))}
    </div>,
    document.body
  );
}

// Base Modal Component
function Modal({ 
  id,
  title,
  children,
  size = 'md',
  closable = true,
  onClose,
  zIndex = 1000,
  className,
  ...props
}) {
  const { closeModal } = useContext(ModalContext) || {};

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closable) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [closable]);

  const handleClose = () => {
    onClose?.();
    closeModal?.(id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      handleClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ zIndex }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="dialog-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={clsx(
          'dialog-content relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-h-[90vh] overflow-hidden',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || closable) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {closable && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Dialog Component (alias for Modal with different styling)
export const Dialog = Modal;

// Confirmation Dialog
export function ConfirmationDialog({
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'destructive',
  onConfirm,
  onCancel,
  ...props
}) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      title={title}
      size="sm"
      {...props}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Form Modal
export function FormModal({
  title,
  onSubmit,
  onCancel,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  isSubmitting = false,
  ...props
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal
      title={title}
      closable={!isSubmitting}
      {...props}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Quick View Modal for CRM entities
export function QuickViewModal({
  entity,
  entityType,
  onEdit,
  onClose,
  ...props
}) {
  const getEntityIcon = (type) => {
    switch (type) {
      case 'contact':
        return <UserIcon className="h-5 w-5" />;
      case 'lead':
        return <UserPlusIcon className="h-5 w-5" />;
      case 'deal':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'ticket':
        return <TicketIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {getEntityIcon(entityType)}
          <span>{entity?.name || entity?.title}</span>
        </div>
      }
      size="lg"
      onClose={onClose}
      {...props}
    >
      <div className="space-y-6">
        {/* Entity Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entityType === 'contact' && (
            <>
              <InfoField label="Email" value={entity.email} />
              <InfoField label="Phone" value={entity.phone} />
              <InfoField label="Company" value={entity.company} />
              <InfoField label="Title" value={entity.title} />
            </>
          )}
          {entityType === 'lead' && (
            <>
              <InfoField label="Source" value={entity.source} />
              <InfoField label="Score" value={`${entity.score}/100`} />
              <InfoField label="Status" value={entity.status} />
              <InfoField label="Value" value={`$${entity.value?.toLocaleString()}`} />
            </>
          )}
          {entityType === 'deal' && (
            <>
              <InfoField label="Stage" value={entity.stage} />
              <InfoField label="Value" value={`$${entity.value?.toLocaleString()}`} />
              <InfoField label="Probability" value={`${entity.probability}%`} />
              <InfoField label="Close Date" value={entity.closeDate} />
            </>
          )}
        </div>

        {/* Notes */}
        {entity.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Notes
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
              {entity.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button onClick={() => onEdit?.(entity)}>
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Info Field Component for Quick View
function InfoField({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-white mt-1">
        {value}
      </dd>
    </div>
  );
}

// CRM-specific modals
export const CRMModals = {
  // Contact creation modal
  createContact: (onSubmit) => ({
    title: 'Add New Contact',
    size: 'md',
    children: <ContactForm onSubmit={onSubmit} />,
  }),

  // Lead creation modal
  createLead: (onSubmit) => ({
    title: 'Add New Lead',
    size: 'md',
    children: <LeadForm onSubmit={onSubmit} />,
  }),

  // Deal creation modal
  createDeal: (onSubmit) => ({
    title: 'Create New Deal',
    size: 'lg',
    children: <DealForm onSubmit={onSubmit} />,
  }),

  // Delete confirmation
  deleteConfirmation: (entityName, onConfirm) => ({
    title: 'Delete Confirmation',
    message: `Are you sure you want to delete "${entityName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'destructive',
    onConfirm,
  }),

  // Bulk action confirmation
  bulkActionConfirmation: (action, count, onConfirm) => ({
    title: `Bulk ${action}`,
    message: `Are you sure you want to ${action.toLowerCase()} ${count} items?`,
    confirmText: action,
    cancelText: 'Cancel',
    onConfirm,
  }),
};

// Hook for common CRM modals
export function useCRMModals() {
  const { openModal, closeModal } = useModal();

  return {
    openContactForm: (onSubmit) => openModal({
      ...CRMModals.createContact(onSubmit),
      component: FormModal,
    }),
    
    openLeadForm: (onSubmit) => openModal({
      ...CRMModals.createLead(onSubmit),
      component: FormModal,
    }),
    
    openDealForm: (onSubmit) => openModal({
      ...CRMModals.createDeal(onSubmit),
      component: FormModal,
    }),

    confirmDelete: (entityName, onConfirm) => openModal({
      ...CRMModals.deleteConfirmation(entityName, onConfirm),
      component: ConfirmationDialog,
    }),

    confirmBulkAction: (action, count, onConfirm) => openModal({
      ...CRMModals.bulkActionConfirmation(action, count, onConfirm),
      component: ConfirmationDialog,
    }),

    showQuickView: (entity, entityType, onEdit) => openModal({
      component: QuickViewModal,
      entity,
      entityType,
      onEdit,
    }),

    closeModal,
  };
}

// Placeholder form components (these would be implemented separately)
function ContactForm({ onSubmit }) {
  return <div>Contact form would go here</div>;
}

function LeadForm({ onSubmit }) {
  return <div>Lead form would go here</div>;
}

function DealForm({ onSubmit }) {
  return <div>Deal form would go here</div>;
}

// Icon components
const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserPlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const TicketIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default Modal;