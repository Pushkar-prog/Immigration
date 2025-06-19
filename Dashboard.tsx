import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import TouristForm from "./TouristForm";
import TouristList from "./TouristList";
import StatsCards from "./StatsCards";
import MediaAlerts from "./MediaAlerts";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "add" | "alerts">("overview");
  const stats = useQuery(api.tourists.getDashboardStats);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "add", label: "Add Tourist", icon: "➕" },
    { id: "alerts", label: "Media Alerts", icon: "🚨" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg border-2 border-orange-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg transform scale-105"
                : "text-blue-800 hover:text-blue-900 hover:bg-orange-50 hover:shadow-md"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <StatsCards stats={stats} />
          <TouristList />
        </div>
      )}

      {activeTab === "add" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Tourist</h2>
            <TouristForm />
          </div>
        </div>
      )}

      {activeTab === "alerts" && (
        <MediaAlerts />
      )}
    </div>
  );
}
