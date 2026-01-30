import { useState, useEffect } from 'react';
import { Notice, NoticeFormData } from '@/types';
import { X } from 'lucide-react';

interface NoticeFormProps {
  notice?: Notice | null;
  onSubmit: (data: NoticeFormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
  priority?: string;
}

export default function NoticeForm({ notice, onSubmit, onClose, isLoading }: NoticeFormProps) {
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    expiresAt: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        priority: notice.priority,
        expiresAt: notice.expiresAt ? notice.expiresAt.split('T')[0] : '',
      });
    }
  }, [notice]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Content must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit({
      ...formData,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-heading font-semibold text-xl text-foreground">
            {notice ? 'Edit Notice' : 'Create New Notice'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label-text">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="Enter notice title"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="label-text">
              Content <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className={`input-field resize-none ${errors.content ? 'border-destructive focus:ring-destructive' : ''}`}
              placeholder="Enter notice content"
            />
            {errors.content && <p className="error-text">{errors.content}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.content.length}/1000 characters
            </p>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="label-text">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="label-text">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiresAt" className="label-text">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : notice ? 'Update Notice' : 'Create Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
