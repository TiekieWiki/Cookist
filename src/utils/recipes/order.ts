import { OrderBy, OrderDirection, RecipeOrderCategories, type RecipeOrder } from "../types/orderFilter";

/**
 * Every order by / order direction combination, keyed by its combined category
 */
export const recipeOrders: RecipeOrder[] = Object.entries(OrderBy).flatMap(([orderByKey, orderBy]) =>
  Object.entries(OrderDirection).map(([directionKey, orderDirection]) => ({
    value: `${orderByKey}${directionKey.charAt(0).toUpperCase()}${directionKey.slice(1)}` as RecipeOrderCategories,
    orderBy,
    orderDirection
  }))
);

/**
 * Combine an order by and order direction into a single category
 * @param orderBy Column to order on
 * @param orderDirection Direction to order in
 * @returns The matching category
 */
export function combineOrder(
  orderBy: OrderBy,
  orderDirection: OrderDirection
): RecipeOrderCategories {
  const order = recipeOrders.find(
    (recipeOrder) =>
      recipeOrder.orderBy === orderBy && recipeOrder.orderDirection === orderDirection
  );

  return (order ?? recipeOrders[0]).value;
}

/**
 * Split a category back into an order by and direction
 * @param value Combined category
 * @returns The matching order by and direction
 */
export function splitOrder(value: RecipeOrderCategories): RecipeOrder {
  return recipeOrders.find((recipeOrder) => recipeOrder.value === value) ?? recipeOrders[0];
}

