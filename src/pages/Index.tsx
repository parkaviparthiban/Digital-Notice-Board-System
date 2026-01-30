import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotices } from '@/context/NoticeContext';
import Layout from '@/components/layout/Layout';
import NoticeCard from '@/components/notices/NoticeCard';
import { Bell, Shield, Zap, Users, ArrowRight } from 'lucide-react';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { notices } = useNotices();

  // Get latest 4 notices
  const latestNotices = notices.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bell className="w-4 h-4" />
              <span>Digital Notice Board System</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stay Updated with
              <span className="block" style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Important Notices
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A centralized platform to manage, publish, and view all important announcements and notices in one convenient place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary-gradient flex items-center gap-2 text-lg px-8 py-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary-gradient flex items-center gap-2 text-lg px-8 py-3"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Why Use Digital Notice Board?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides a streamlined solution for managing and distributing notices efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Real-time Updates
              </h3>
              <p className="text-muted-foreground">
                Get instant notifications when new notices are published. Never miss an important announcement.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Secure Access
              </h3>
              <p className="text-muted-foreground">
                Role-based authentication ensures only authorized users can create and manage notices.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Easy Collaboration
              </h3>
              <p className="text-muted-foreground">
                Multiple administrators can create and manage notices, making collaboration seamless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notices Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                Latest Notices
              </h2>
              <p className="text-muted-foreground">
                Recent announcements and updates
              </p>
            </div>
            <Link
              to="/notices"
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {latestNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Create an account to start posting and managing notices for your organization.
            </p>
            <Link
              to="/register"
              className="btn-primary-gradient inline-flex items-center gap-2 text-lg px-8 py-3"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-foreground">
                Digital Notice Board
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Digital Notice Board. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
