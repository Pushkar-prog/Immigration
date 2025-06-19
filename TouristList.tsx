import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import TouristCard from "./TouristCard";

export default function TouristList() {
  const tourists = useQuery(api.tourists.getAllTourists);
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = ["All", "Active", "Expired", "Alert Sent", "Left", "Renewed"];

  const filteredTourists = tourists?.filter(tourist => {
    const matchesFilter = filter === "All" || tourist.status === filter;
    const matchesSearch = searchTerm === "" || 
      tourist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) || [];

  if (tourists === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Tourist Records ({filteredTourists.length})
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, nationality, or passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-64"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filters.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredTourists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tourists found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first tourist record"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTourists.map((tourist) => (
              <TouristCard key={tourist._id} tourist={tourist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
