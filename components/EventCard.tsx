import { SchoolEvent } from "@/types/news";
import { formatDateShort } from "@/lib/utils";

interface EventCardProps {
  event: SchoolEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const [day, month] = formatDateShort(event.date).split(" ");

  return (
    <li className="group flex gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-700 text-white">
        <span className="text-lg font-bold leading-none">{day}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-wide text-accent-300">
          {month}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-base font-bold leading-snug text-ink-900">
          {event.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{event.description}</p>
      </div>
    </li>
  );
}
