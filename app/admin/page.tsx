import StatCard from "@/components/admin/StatCard";
import RecentRequests from "@/components/admin/RecentRequests";
import { getDashboardData } from "@/lib/admin/actions/stats";
import { Users, UserCheck, Briefcase, FileText } from 'lucide-react';

const AdminDashboardPage = async () => {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    return <p className="text-destructive">Error loading dashboard data.</p>;
  }

  const { stats, recentPendingUsers } = result.data;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Pending Requests" value={stats.pendingUsers} icon={UserCheck} />
        <StatCard title="Total Jobs" value={stats.totalJobs} icon={Briefcase} />
        <StatCard title="Total Applications" value={stats.totalApplications} icon={FileText} />
      </div>
      <div className="mt-8">
        <RecentRequests users={recentPendingUsers} />
      </div>
    </section>
  );
};

export default AdminDashboardPage;
