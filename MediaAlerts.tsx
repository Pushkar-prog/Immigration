import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MediaAlerts() {
  const tourists = useQuery(api.tourists.getAllTourists);

  const expiredTourists = tourists?.filter(tourist => 
    tourist.status === "Expired" && !tourist.exitDate && !tourist.renewalDate
  ) || [];

  const criticalAlerts = expiredTourists.filter(tourist => {
    const today = new Date();
    const expirationDate = new Date(tourist.visaExpirationDate);
    const daysPastExpiration = Math.ceil((today.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysPastExpiration > 7; // More than 7 days past expiration
  });

  if (tourists === undefined) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h2 className="text-xl font-bold text-red-900">Critical Media Alerts</h2>
              <p className="text-red-700">Tourists with expired visas requiring immediate attention</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {criticalAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Critical Alerts</h3>
              <p className="text-gray-600">All visa expirations are within acceptable timeframes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {criticalAlerts.map((tourist) => {
                const today = new Date();
                const expirationDate = new Date(tourist.visaExpirationDate);
                const daysPastExpiration = Math.ceil((today.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={tourist._id} className="border border-red-300 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <h3 className="font-bold text-red-900">{tourist.fullName}</h3>
                          <p className="text-red-700">{tourist.nationality} • {tourist.passportNumber}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-medium rounded-full">
                        {daysPastExpiration} days overdue
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-red-600 font-medium">Visa Expired:</span>
                        <p className="text-red-900">{new Date(tourist.visaExpirationDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">Location:</span>
                        <p className="text-red-900">{tourist.intendedLocation}</p>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">Contact:</span>
                        <p className="text-red-900">{tourist.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-100 rounded border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">Recommended Actions:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Contact tourist immediately for status update</li>
                        <li>• Verify if tourist has left India</li>
                        <li>• Check for visa renewal applications</li>
                        <li>• Consider escalation to immigration authorities</li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All Expired Visas */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Expired Visas</h2>
              <p className="text-gray-600">Complete list of tourists with expired visas</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {expiredTourists.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired Visas</h3>
              <p className="text-gray-600">All tourist visas are currently valid</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Tourist</th>
                    <th className="text-left py-3 px-2">Nationality</th>
                    <th className="text-left py-3 px-2">Visa Number</th>
                    <th className="text-left py-3 px-2">Expired Date</th>
                    <th className="text-left py-3 px-2">Days Overdue</th>
                    <th className="text-left py-3 px-2">Location</th>
                    <th className="text-left py-3 px-2">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredTourists.map((tourist) => {
                    const today = new Date();
                    const expirationDate = new Date(tourist.visaExpirationDate);
                    const daysPastExpiration = Math.ceil((today.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={tourist._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="font-medium">{tourist.fullName}</div>
                          <div className="text-gray-600">{tourist.passportNumber}</div>
                        </td>
                        <td className="py-3 px-2">{tourist.nationality}</td>
                        <td className="py-3 px-2">{tourist.visaNumber}</td>
                        <td className="py-3 px-2">
                          <span className="text-red-600 font-medium">
                            {expirationDate.toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            daysPastExpiration > 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {daysPastExpiration} days
                          </span>
                        </td>
                        <td className="py-3 px-2">{tourist.intendedLocation}</td>
                        <td className="py-3 px-2">
                          {tourist.lastReminderDate ? 
                            new Date(tourist.lastReminderDate).toLocaleDateString() : 
                            "No contact"
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <div className="text-sm text-red-700">Critical Alerts</div>
            <div className="text-xs text-red-600">7+ days overdue</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{expiredTourists.length - criticalAlerts.length}</div>
            <div className="text-sm text-yellow-700">Recent Expired</div>
            <div className="text-xs text-yellow-600">Within 7 days</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {tourists?.filter(t => t.status === "Alert Sent").length || 0}
            </div>
            <div className="text-sm text-blue-700">Alerts Sent</div>
            <div className="text-xs text-blue-600">Pending response</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tourists?.filter(t => t.status === "Active").length || 0}
            </div>
            <div className="text-sm text-green-700">Active Visas</div>
            <div className="text-xs text-green-600">No action needed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
