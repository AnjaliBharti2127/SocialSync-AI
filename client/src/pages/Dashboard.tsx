import { useState, useEffect } from "react";
import {
  ClockIcon,
  Share2Icon,
  CheckCircleIcon,
  TrendingUpIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";

// import {
//   dummyPostData,
//   dummyAccountData,
//   dummyActivityData,
// } from "../data/dumData";
import api from "../api/axios";

type Post = {
  id: number;
  status: string;
};

type Account = {
  id: number;
  status: string;
};

type Activity = {
  _id: string;
  description: string;
  createdAt: string | Date;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activitiesRes] = await Promise.all([api.get("/api/posts"), api.get("/api/accounts"), api.get("/api/activity")])

        const posts: Post[] = postsRes.data;
        const accounts: Account[] = accountsRes.data;

        setStats({
          scheduled: posts.filter((p) => p.status === "scheduled").length,
          published: posts.filter((p) => p.status === "published").length,
          connectedAccounts: accounts.filter((a) => a.status === "connected")
            .length,
        });

        setActivities(activitiesRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 today",
      accent: "bg-[#FF6F91]",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "All time",
      accent: "bg-[#2BB8D6]",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active",
      accent: "bg-[#8E7CFF]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative rounded-2xl bg-white/[0.03] px-8 py-10 overflow-hidden border border-white/[0.06]">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-[110px] opacity-20" />

        <span className="relative inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 bg-white/[0.06] px-3.5 py-1.5 rounded-full">
          <SparklesIcon className="size-3 text-[#A06CD5]" />
          Workspace overview
        </span>

        <h2 className="relative text-4xl md:text-[2.75rem] font-semibold text-white tracking-tight mt-5 leading-[1.05]">
          Everything's running
          <br />
          <span className="bg-gradient-to-r from-[#FF8A65]  to-[#3D7BFA] bg-clip-text text-transparent">
            smoothly today.
          </span>
        </h2>

        <p className="relative text-slate-500 mt-3 max-w-md leading-relaxed text-[15px]">
          Manage accounts, queue content, and track performance — all in one
          refined view.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="group bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06] hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl ${card.accent}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.05] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUpIcon className="size-3" />
                  {card.trend}
                </span>
              </div>

              <div className="text-4xl font-semibold text-slate-100 tabular-nums tracking-tight">
                {card.value}
              </div>

              <h3 className="text-sm font-medium text-slate-500 mt-1.5">
                {card.label}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
          <h2 className="text-slate-100 font-semibold tracking-tight text-[15px]">
            Recent Activity
          </h2>

          <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.05] px-2.5 py-1 rounded-full">
            {activities.length} events
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-16 text-center">
            <div className="p-3 rounded-xl bg-white/[0.05] mb-2">
              <SendIcon className="size-5 text-[#8E7CFF]" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No activity yet.
            </p>
            <p className="text-sm text-slate-500 max-w-sm">
              Connect an account and schedule your first post to see it
              appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center gap-4 px-7 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#8E7CFF] shrink-0">
                  <SendIcon className="size-4 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 block mb-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>

                  <p className="text-sm text-slate-300 truncate">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;