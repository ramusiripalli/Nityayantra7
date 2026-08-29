import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel = 'Add New Item',
  actionLink = '#',
  onActionClick,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-2xs">
      <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>

      {actionLabel && (
        <div className="pt-2">
          {actionLink !== '#' ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
