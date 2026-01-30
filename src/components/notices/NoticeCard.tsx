import { Notice } from '@/types';
import { Calendar, User, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface NoticeCardProps {
  notice: Notice;
  onEdit?: (notice: Notice) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function NoticeCard({ notice, onEdit, onDelete, showActions = false }: NoticeCardProps) {
  const priorityClass = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  }[notice.priority];

  const categoryClass = {
    general: 'category-general',
    academic: 'category-academic',
    event: 'category-event',
    urgent: 'category-urgent',
  }[notice.category];

  const categoryLabel = {
    general: 'General',
    academic: 'Academic',
    event: 'Event',
    urgent: 'Urgent',
  }[notice.category];

  return (
    <article className={`notice-card ${priorityClass} animate-fade-in`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`category-badge ${categoryClass}`}>
              {categoryLabel}
            </span>
            {notice.priority === 'high' && (
              <span className="category-badge bg-destructive/10 text-destructive">
                High Priority
              </span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            {notice.title}
          </h3>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit?.(notice)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit notice"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(notice.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {notice.content}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>{notice.author.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(notice.createdAt), 'MMM d, yyyy')}</span>
        </div>
        {notice.expiresAt && (
          <div className="flex items-center gap-1.5 text-warning">
            <span>Expires: {format(new Date(notice.expiresAt), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </article>
  );
}
