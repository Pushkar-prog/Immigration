interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    alertSent: number;
    left: number;
    renewed: number;
  } | undefined;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Tourists",
      value: stats.total,
      icon: "👥",
      color: "bg-blue-800",
      textColor: "text-blue-800",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Visas",
      value: stats.active,
      icon: "✅",
      color: "bg-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Expired",
      value: stats.expired,
      icon: "❌",
      color: "bg-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
    {
      title: "Alerts Sent",
      value: stats.alertSent,
      icon: "⚠️",
      color: "bg-orange-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
    },
    {
      title: "Left India",
      value: stats.left,
      icon: "✈️",
      color: "bg-gray-600",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
    },
    {
      title: "Renewed",
      value: stats.renewed,
      icon: "🔄",
      color: "bg-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${card.color.replace('bg-', 'border-')}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
            <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
          </div>
          <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
            {card.value}
          </div>
          <div className="text-sm text-gray-600">{card.title}</div>
        </div>
      ))}
    </div>
  );
}
