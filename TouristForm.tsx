import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export default function TouristForm() {
  const addTourist = useMutation(api.tourists.addTourist);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    passportNumber: "",
    visaNumber: "",
    visaType: "Tourist",
    visaExpirationDate: "",
    dateOfEntry: "",
    durationOfStay: 0,
    intendedLocation: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const [passengers, setPassengers] = useState([formData]);
  const [activePassenger, setActivePassenger] = useState(0);

  const visaTypes = [
    "Tourist",
    "Business",
    "Medical",
    "Conference",
    "Student",
    "Employment",
    "Transit",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addTourist({
        ...formData,
        notes: formData.notes || undefined,
      });
      
      toast.success("Tourist record added successfully!");
      
      // Reset form
      setFormData({
        fullName: "",
        nationality: "",
        passportNumber: "",
        visaNumber: "",
        visaType: "Tourist",
        visaExpirationDate: "",
        dateOfEntry: "",
        durationOfStay: 30,
        intendedLocation: "",
        email: "",
        phoneNumber: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to add tourist record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate duration automatically
  const calculateDuration = (entryDate: string, expiryDate: string) => {
    if (entryDate && expiryDate) {
      const entry = new Date(entryDate);
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - entry.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };

    // Auto-calculate duration when dates change
    if (name === "dateOfEntry" || name === "visaExpirationDate") {
      updatedData.durationOfStay = calculateDuration(
        name === "dateOfEntry" ? value : formData.dateOfEntry,
        name === "visaExpirationDate" ? value : formData.visaExpirationDate
      );
    }

    setFormData(updatedData);
  };

  const addPassenger = () => {
    const newPassenger = {
      fullName: "",
      nationality: formData.nationality,
      passportNumber: "",
      visaNumber: "",
      visaType: formData.visaType,
      visaExpirationDate: formData.visaExpirationDate,
      dateOfEntry: formData.dateOfEntry,
      durationOfStay: formData.durationOfStay,
      intendedLocation: formData.intendedLocation,
      email: "",
      phoneNumber: "",
      notes: "",
    };
    setPassengers([...passengers, newPassenger]);
    setActivePassenger(passengers.length);
    setFormData(newPassenger);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Personal Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality *
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              placeholder="e.g., American, British, German"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passport Number *
            </label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Visa Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Visa Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visa Number *
            </label>
            <input
              type="text"
              name="visaNumber"
              value={formData.visaNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visa Type *
            </label>
            <select
              name="visaType"
              value={formData.visaType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {visaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visa Expiration Date *
            </label>
            <input
              type="date"
              name="visaExpirationDate"
              value={formData.visaExpirationDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Entry *
            </label>
            <input
              type="date"
              name="dateOfEntry"
              value={formData.dateOfEntry}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration of Stay (days) - Auto Calculated
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-50 text-green-800 font-semibold text-lg">
              {formData.durationOfStay > 0 ? `${formData.durationOfStay} days` : "Enter dates to calculate"}
            </div>
            <p className="text-xs text-green-600 mt-1">
              📅 Automatically calculated from Entry Date to Visa Expiry Date
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intended Location in India *
            </label>
            <input
              type="text"
              name="intendedLocation"
              value={formData.intendedLocation}
              onChange={handleChange}
              required
              placeholder="e.g., Mumbai, Delhi, Bangalore"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional information or special circumstances..."
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addPassenger}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white font-medium rounded-md hover:from-orange-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        >
          👨‍👩‍👧‍👦 Add More Passenger
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {isSubmitting ? "Adding..." : `Add ${passengers.length > 1 ? `${passengers.length} ` : ""}Tourist Record${passengers.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}
