import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { CalendarApi, type EventBody } from '@features/calendar/data/api/CalendarApi';
import {
  eventResponseSchema,
  occurrencesResponseSchema,
  type CalendarEvent,
  type CalendarOccurrence,
} from '@features/calendar/data/schemas/calendarSchema';

export class CalendarRepository {
  private api: CalendarApi;

  constructor(client: ApiClient) {
    this.api = new CalendarApi(client);
  }

  async list(householdId: string, from: Date, to: Date): Promise<CalendarOccurrence[]> {
    try {
      return occurrencesResponseSchema.parse(await this.api.list(householdId, from.toISOString(), to.toISOString())).data;
    } catch (error) {
      Logger.error('Error listando eventos', error);
      throw error;
    }
  }

  async create(householdId: string, body: EventBody): Promise<CalendarEvent> {
    try {
      return eventResponseSchema.parse(await this.api.create(householdId, body)).data;
    } catch (error) {
      Logger.error('Error creando evento', error);
      throw error;
    }
  }

  async update(eventId: string, body: Partial<EventBody>): Promise<CalendarEvent> {
    try {
      return eventResponseSchema.parse(await this.api.update(eventId, body)).data;
    } catch (error) {
      Logger.error('Error editando evento', error);
      throw error;
    }
  }

  async remove(eventId: string): Promise<void> {
    try {
      await this.api.remove(eventId);
    } catch (error) {
      Logger.error('Error borrando evento', error);
      throw error;
    }
  }
}
