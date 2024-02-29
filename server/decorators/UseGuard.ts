import { RouteGuards } from "../interface/guards.interface";

export function UseGuard(...guards: RouteGuards[]) {
  return function (
    target: any,
    propertyKey?: string,
    description?: PropertyDescriptor
  ) {
    if (propertyKey === undefined) {
      if (!target.guards) {
        target.guards = [];
      }

      target.guards.push(...(Array.isArray(guards) ? guards : [guards]));
    } else {
      if (!target.guards) {
        target.guards = [];
      }
      if (!target.guards[propertyKey]) {
        target.guards[propertyKey] = [];
      }
      target.guards[propertyKey].push(
        ...(Array.isArray(guards) ? guards : [guards])
      );
    }
  };
}
