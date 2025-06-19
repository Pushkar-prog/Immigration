import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface Tourist {
  _id: Id<"tourists">;
  fullName: string;
  nationality: string;
  passportNumber: string;
  visaNumber: string;
  visaType: string;
  visaExpirationDate: string;
  dateOfEntry: string;
  durationOfStay: number;
  intendedLocation: string;
  email: string;
  phoneNumber: string;
  status: string;
  reminderSent: boolean;
  lastReminderDate?: string;
  exitDate?: string;
  renewalDate?: string;
  notes?: string;
}

interface TouristCardProps {
  tourist: Tourist;
}

export default function TouristCard({ tourist }: TouristCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const [showExitForm, setShowExitForm] = useState(false);
  
  const sendReminder = useMutation(api.tourists.sendReminder);
  const markAsExited = useMutation(api.tourists.markAsExited);
  const markAsRenewed = useMutation(api.tourists.markAsRenewed);

  const [renewalData, setRenewalData] = useState({
    renewalDate: new Date().toISOString().split('T')[0],
    newExpirationDate: "",
    notes: "",
  });

  const [exitData, setExitData] = useState({
    exitDate: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "Alert Sent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Left":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Renewed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCountryFlag = (nationality: string) => {
    const flags: { [key: string]: string } = {
      "American": "🇺🇸",
      "British": "🇬🇧",
      "German": "🇩🇪",
      "French": "🇫🇷",
      "Japanese": "🇯🇵",
      "Chinese": "🇨🇳",
      "Australian": "🇦🇺",
      "Canadian": "🇨🇦",
      "Italian": "🇮🇹",
      "Spanish": "🇪🇸",
      "Russian": "🇷🇺",
      "Brazilian": "🇧🇷",
    };
    return flags[nationality] || "🌍";
  };

  const getDaysUntilExpiration = () => {
    const today = new Date();
    const expirationDate = new Date(tourist.visaExpirationDate);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSendReminder = async () => {
    try {
      const result = await sendReminder({ touristId: tourist._id });
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to send reminder");
    }
  };

  const handleMarkAsRenewed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markAsRenewed({
        touristId: tourist._id,
        ...renewalData,
        notes: renewalData.notes || undefined,
      });
      toast.success("Visa marked as renewed");
      setShowRenewalForm(false);
      setShowActions(false);
    } catch (error) {
      toast.error("Failed to mark as renewed");
    }
  };

  const handleMarkAsExited = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markAsExited({
        touristId: tourist._id,
        ...exitData,
        notes: exitData.notes || undefined,
      });
      toast.success("Tourist marked as exited");
      setShowExitForm(false);
      setShowActions(false);
    } catch (error) {
      toast.error("Failed to mark as exited");
    }
  };

  const getVisaStatusInfo = () => {
    const days = getDaysUntilExpiration();
    
    if (tourist.exitDate) return { status: "Left", color: "bg-gray-100 text-gray-800", alert: false };
    if (tourist.renewalDate) return { status: "✅ Renewed", color: "bg-green-100 text-green-800", alert: false };
    
    if (days < 0) return { 
      status: "❌ Visa Expired", 
      color: "bg-red-100 text-red-800 border-red-300", 
      alert: true,
      message: "Action Needed"
    };
    
    if (days <= 5) return { 
      status: "⚠️ Expiring Soon", 
      color: "bg-orange-100 text-orange-800 border-orange-300", 
      alert: true,
      message: `${days} days left`
    };
    
    return { status: "Active", color: "bg-green-100 text-green-800", alert: false };
  };

  const daysUntilExpiration = getDaysUntilExpiration();
  const statusInfo = getVisaStatusInfo();

  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
      statusInfo.alert 
        ? statusInfo.color.includes('red') 
          ? "border-red-300 bg-red-50 shadow-red-200 shadow-lg" 
          : "border-orange-300 bg-orange-50 shadow-orange-200 shadow-lg"
        : "border-gray-200 bg-white hover:shadow-md"
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCountryFlag(tourist.nationality)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{tourist.fullName}</h3>
            <p className="text-sm text-gray-600">{tourist.nationality} • {tourist.passportNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${statusInfo.color} ${statusInfo.alert ? 'animate-pulse' : ''}`}>
            {statusInfo.status}
          </span>
          {statusInfo.alert && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              {statusInfo.message}
            </span>
          )}
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            ⋮
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Visa:</span>
          <p className="font-medium">{tourist.visaNumber}</p>
          <p className="text-xs text-gray-600">{tourist.visaType}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Expires:</span>
          <p className="font-medium">{new Date(tourist.visaExpirationDate).toLocaleDateString()}</p>
          <p className={`text-xs ${daysUntilExpiration < 0 ? 'text-red-600' : daysUntilExpiration <= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
            {daysUntilExpiration < 0 ? `${Math.abs(daysUntilExpiration)} days overdue` : 
             daysUntilExpiration === 0 ? 'Expires today' :
             `${daysUntilExpiration} days left`}
          </p>
        </div>
        
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="font-medium">{tourist.intendedLocation}</p>
        </div>
        
        <div>
          <span className="text-gray-500">Contact:</span>
          <p className="font-medium text-xs">{tourist.email}</p>
          <p className="text-xs text-gray-600">{tourist.phoneNumber}</p>
        </div>
      </div>

      {tourist.lastReminderDate && (
        <div className="mt-3 text-xs text-gray-600">
          Last reminder sent: {new Date(tourist.lastReminderDate).toLocaleDateString()}
        </div>
      )}

      {/* Action Menu */}
      {showActions && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSendReminder}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              📧 Send Reminder
            </button>
            
            {tourist.status !== "Left" && (
              <button
                onClick={() => setShowExitForm(true)}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                ✈️ Mark as Exited
              </button>
            )}
            
            {tourist.status !== "Renewed" && tourist.status !== "Left" && (
              <button
                onClick={() => setShowRenewalForm(true)}
                className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                🔄 Mark as Renewed
              </button>
            )}
          </div>
        </div>
      )}

      {/* Renewal Form */}
      {showRenewalForm && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-3">Mark Visa as Renewed</h4>
          <form onSubmit={handleMarkAsRenewed} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Renewal Date
                </label>
                <input
                  type="date"
                  value={renewalData.renewalDate}
                  onChange={(e) => setRenewalData(prev => ({ ...prev, renewalDate: e.target.value }))}
                  required
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Expiration Date
                </label>
                <input
                  type="date"
                  value={renewalData.newExpirationDate}
                  onChange={(e) => setRenewalData(prev => ({ ...prev, newExpirationDate: e.target.value }))}
                  required
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={renewalData.notes}
                onChange={(e) => setRenewalData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Additional notes about the renewal..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Confirm Renewal
              </button>
              <button
                type="button"
                onClick={() => setShowRenewalForm(false)}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exit Form */}
      {showExitForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Mark Tourist as Exited</h4>
          <form onSubmit={handleMarkAsExited} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Exit Date
              </label>
              <input
                type="date"
                value={exitData.exitDate}
                onChange={(e) => setExitData(prev => ({ ...prev, exitDate: e.target.value }))}
                required
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={exitData.notes}
                onChange={(e) => setExitData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Additional notes about the exit..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Confirm Exit
              </button>
              <button
                type="button"
                onClick={() => setShowExitForm(false)}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
