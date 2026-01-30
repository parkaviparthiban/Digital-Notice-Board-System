import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotices } from '@/context/NoticeContext';
import { Notice, NoticeFormData } from '@/types';
import Layout from '@/components/layout/Layout';
import NoticeCard from '@/components/notices/NoticeCard';
import NoticeForm from '@/components/notices/NoticeForm';
import NoticeFilters from '@/components/notices/NoticeFilters';
import { Plus, FileText, AlertTriangle, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const { notices, isLoading, addNotice, updateNotice, deleteNotice } = useNotices();
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Filter notices
  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || notice.category === categoryFilter;
      const matchesPriority = !priorityFilter || notice.priority === priorityFilter;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [notices, searchQuery, categoryFilter, priorityFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: notices.length,
    urgent: notices.filter(n => n.category === 'urgent' || n.priority === 'high').length,
    thisWeek: notices.filter(n => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(n.createdAt) >= weekAgo;
    }).length,
    authors: new Set(notices.map(n => n.author.id)).size,
  }), [notices]);

  const handleSubmit = async (data: NoticeFormData) => {
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, data);
        toast.success('Notice updated successfully');
      } else {
        await addNotice(data);
        toast.success('Notice created successfully');
      }
      setShowForm(false);
      setEditingNotice(null);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await deleteNotice(id);
      toast.success('Notice deleted successfully');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNotice(null);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-white/80 mt-1">
                Manage and view all your notices in one place
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-white text-primary font-medium py-2.5 px-5 rounded-lg hover:bg-white/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Notice</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Notices</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.urgent}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.authors}</p>
                <p className="text-sm text-muted-foreground">Contributors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <NoticeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />

        {/* Notices Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map(notice => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter || priorityFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first notice to get started'}
              </p>
              {!searchQuery && !categoryFilter && !priorityFilter && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary-gradient"
                >
                  Create Notice
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notice Form Modal */}
        {showForm && (
          <NoticeForm
            notice={editingNotice}
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            isLoading={isLoading}
          />
        )}
      </div>
    </Layout>
  );
}
