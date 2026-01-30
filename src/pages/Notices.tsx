import { useState, useMemo } from 'react';
import { useNotices } from '@/context/NoticeContext';
import Layout from '@/components/layout/Layout';
import NoticeCard from '@/components/notices/NoticeCard';
import NoticeFilters from '@/components/notices/NoticeFilters';
import { FileText } from 'lucide-react';

export default function Notices() {
  const { notices } = useNotices();
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            All Notices
          </h1>
          <p className="text-muted-foreground">
            Browse all published notices and announcements
          </p>
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
                showActions={false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notices found</h3>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter || priorityFilter
                  ? 'Try adjusting your filters'
                  : 'No notices have been published yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
