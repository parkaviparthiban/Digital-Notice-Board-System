import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notice, NoticeFormData } from '@/types';
import { useAuth } from './AuthContext';

interface NoticeContextType {
  notices: Notice[];
  isLoading: boolean;
  addNotice: (data: NoticeFormData) => Promise<Notice>;
  updateNotice: (id: string, data: NoticeFormData) => Promise<Notice | null>;
  deleteNotice: (id: string) => Promise<boolean>;
  getNoticeById: (id: string) => Notice | undefined;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

// Initial mock notices - In production, this would come from MongoDB via Express API
const initialNotices: Notice[] = [
  {
    id: '1',
    title: 'Welcome to Digital Notice Board',
    content: 'This is the official digital notice board for our institution. Stay updated with the latest announcements, events, and important information.',
    category: 'general',
    priority: 'medium',
    author: { id: '1', name: 'Admin User' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Semester Examination Schedule',
    content: 'The end semester examinations will commence from March 15, 2025. Students are advised to check the detailed schedule on the academic portal.',
    category: 'academic',
    priority: 'high',
    author: { id: '1', name: 'Admin User' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    expiresAt: new Date(Date.now() + 604800000).toISOString(),
  },
  {
    id: '3',
    title: 'Annual Tech Fest 2025',
    content: 'Join us for the Annual Tech Fest on April 5-7, 2025. Register now to participate in coding competitions, hackathons, and workshops.',
    category: 'event',
    priority: 'medium',
    author: { id: '1', name: 'Admin User' },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Library Closure Notice',
    content: 'The central library will remain closed on February 1st for maintenance work. Digital resources will continue to be accessible online.',
    category: 'urgent',
    priority: 'high',
    author: { id: '1', name: 'Admin User' },
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addNotice = useCallback(async (data: NoticeFormData): Promise<Notice> => {
    setIsLoading(true);
    
    // Simulate API call - Replace with actual API call to your Express backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNotice: Notice = {
      id: String(Date.now()),
      ...data,
      author: {
        id: user?.id || '0',
        name: user?.name || 'Unknown',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotices(prev => [newNotice, ...prev]);
    setIsLoading(false);
    return newNotice;
  }, [user]);

  const updateNotice = useCallback(async (id: string, data: NoticeFormData): Promise<Notice | null> => {
    setIsLoading(true);
    
    // Simulate API call - Replace with actual API call to your Express backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedNotice: Notice | null = null;
    
    setNotices(prev => prev.map(notice => {
      if (notice.id === id) {
        updatedNotice = {
          ...notice,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return updatedNotice;
      }
      return notice;
    }));

    setIsLoading(false);
    return updatedNotice;
  }, []);

  const deleteNotice = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call - Replace with actual API call to your Express backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNotices(prev => prev.filter(notice => notice.id !== id));
    setIsLoading(false);
    return true;
  }, []);

  const getNoticeById = useCallback((id: string): Notice | undefined => {
    return notices.find(notice => notice.id === id);
  }, [notices]);

  return (
    <NoticeContext.Provider value={{ notices, isLoading, addNotice, updateNotice, deleteNotice, getNoticeById }}>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotices() {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
}
