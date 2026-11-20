import { createApiClient } from '@core/network/apiClient';
import { CalendarRepository } from '@features/calendar/data/repository/CalendarRepository';

let repo: CalendarRepository | null = null;

export function getCalendarRepository(): CalendarRepository {
  if (!repo) {
    repo = new CalendarRepository(createApiClient());
  }
  return repo;
}
