import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { ShoppingApi, type NewItemBody } from '@features/shopping/data/api/ShoppingApi';
import {
  shoppingListsResponseSchema,
  shoppingListResponseSchema,
  type ShoppingList,
} from '@features/shopping/data/schemas/shoppingSchema';

/** Nombre de la lista que se crea sola la primera vez (la UI no expone listas). */
const DEFAULT_LIST_NAME = 'Compras';

export class ShoppingRepository {
  private api: ShoppingApi;

  constructor(client: ApiClient) {
    this.api = new ShoppingApi(client);
  }

  async listByHousehold(householdId: string): Promise<ShoppingList[]> {
    try {
      const raw = await this.api.listByHousehold(householdId);
      return shoppingListsResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error listando compras', error);
      throw error;
    }
  }

  async toggleItem(listId: string, itemId: string, isCompleted: boolean): Promise<ShoppingList> {
    try {
      const raw = await this.api.toggleItem(listId, itemId, { is_completed: isCompleted });
      return shoppingListResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error alternando ítem de compras', error);
      throw error;
    }
  }

  /**
   * Agrega un ítem a la lista activa del hogar. El backend exige que exista
   * una lista, pero la UI no expone el concepto de "listas" (solo ítems
   * agrupados por categoría), así que acá se resuelve la primera activa y se
   * crea una si el hogar todavía no tiene ninguna.
   */
  async addItemToDefaultList(householdId: string, item: NewItemBody): Promise<ShoppingList> {
    try {
      const lists = await this.listByHousehold(householdId);
      const listId = lists[0]?.id ?? (await this.createList(householdId)).id;
      const raw = await this.api.addItem(listId, item);
      return shoppingListResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error agregando ítem de compras', error);
      throw error;
    }
  }

  private async createList(householdId: string): Promise<ShoppingList> {
    const raw = await this.api.createList({
      household_id: householdId,
      name: DEFAULT_LIST_NAME,
    });
    return shoppingListResponseSchema.parse(raw).data;
  }
}
