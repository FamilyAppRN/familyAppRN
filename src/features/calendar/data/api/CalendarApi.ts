import type { ApiClient } from '@core/network/apiClient';
import type { Recurrence } from '@features/calendar/data/schemas/calendarSchema';

export interface EventBody {
  title: string;
  description?: string | null;
  /** ISO 8601. */
  start_at: string;
  end_at?: string | null;
  all_day?: boolean;
  recurrence?: Recurrence;
}

export class CalendarApi {
  constructor(private client: ApiClient) {}

  list(householdId: string, from: string, to: string) {
    return this.client.get<unknown>(`/api/calendar/${householdId}`, { params: { from, to } });
  }

  create(householdId: string, body: EventBody) {
    return this.client.post<unknown>(`/api/calendar/${householdId}`, body);
  }

  update(eventId: string, body: Partial<EventBody>) {
    return this.client.patch<unknown>(`/api/calendar/events/${eventId}`, body);
  }

  remove(eventId: string) {
    return this.client.delete<unknown>(`/api/calendar/events/${eventId}`);
  }
}
