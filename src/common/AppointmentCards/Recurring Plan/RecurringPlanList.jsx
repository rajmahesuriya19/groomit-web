import React from "react";
import { ChevronRight } from "lucide-react";
import RecurringIcon from '../../../assets/icon/white-groomit.png';

export default function RecurringPlanList({
  data = [],
  type, // "active" | "cancelled"
  onPressRecurringDetails,
}) {
  if (!data.length) return null;

  return (
    <>
      {data.map((item, index) => {
        let label = "";
        let suffix = "";
        let bgColor = "";

        if (type === "active") {
          const recurringType = item?.recurring_type;
          const capType = recurringType
            ? recurringType.charAt(0).toUpperCase() + recurringType.slice(1)
            : "";

          const totalCompleted = `${item?.totalHistoryAppointments ?? 0}/${item?.totalAppointment ?? 0}`;

          label = `${capType} Plan`;

          suffix =
            capType === "Annual"
              ? `(${totalCompleted} Completed)`
              : `(Next Billing: ${item?.schedule?.day_month ?? ""})`;

          bgColor = "bg-[#0A7170]";
        }

        if (type === "cancelled") {
          label = "Recurring Canceled";
          suffix =
            item?.type === "recurring_cancelled"
              ? `on ${item?.cancel_day}`
              : "";
          bgColor = "bg-[#7C868A]";
        }

        return (
            <div className="w-full" key={index}>
            <div
              className={`flex items-center justify-between gap-2 py-[10px] px-[20px] w-full cursor-pointer ${bgColor}`}
              onClick={onPressRecurringDetails}
            >
              {/* Left side */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <img src={RecurringIcon} alt="Recurring" className="w-6 h-6 flex-shrink-0" />
      
                <div className="text-white text-sm truncate">
                  <span className="font-bold">{label}</span>
                  {suffix && <span className="font-normal"> {suffix}</span>}
                </div>
              </div>
      
              {/* Chevron */}
              <ChevronRight size={24} className="text-white flex-shrink-0" />
            </div>
      
            <div className="mb-2" />
          </div>
        );
      })}
    </>
  );
}
