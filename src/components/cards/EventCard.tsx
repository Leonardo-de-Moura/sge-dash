import React from 'react';
import { MapPin, Users, Clock, Check } from 'lucide-react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
  onActionClick?: (event: EventItem) => void;
  actionLabel?: string;
  isRegistered?: boolean;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onActionClick,
  actionLabel,
  isRegistered = false,
  compact = false,
}) => {
  const [day, month] = event.dayMonth.split(' ');
  const isSoldOut = event.status === 'Esgotado';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-start gap-4 w-full sm:w-auto">
        {/* Date block */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18 rounded-xl bg-gray-50 border border-gray-100 text-center p-1">
          <span className="text-base sm:text-lg font-extrabold text-[#006A38] leading-none">{day}</span>
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase mt-0.5">{month}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006A38] uppercase tracking-wider">
              {event.category}
            </span>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {event.modality}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-1">
            {event.title}
          </h4>

          {!compact && (
            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {event.workload}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {event.enrolledSlots} / {event.totalSlots} inscritos
            </span>
            <span className="flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {event.location.split('-')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Status */}
      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {isRegistered ? (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C9EEB4] text-[#004D26] text-xs font-bold">
            <Check className="w-3.5 h-3.5" />
            Inscrito
          </span>
        ) : isSoldOut ? (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#EFC8C3] text-[#A62B26] text-xs font-bold">
            Esgotado
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onActionClick && onActionClick(event)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#006A38] text-white text-xs font-semibold hover:bg-[#004D26] transition-colors cursor-pointer text-center"
          >
            {actionLabel || 'Inscrever-se'}
          </button>
        )}
      </div>
    </div>
  );
};
