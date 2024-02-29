import "reflect-metadata";

type ControllerDecorator = (basePath: string) => ClassDecorator;

export const Controller: ControllerDecorator = (basePath: string) => {
  return (target: any) => {
    target.prototype.basePath = basePath;
    return target;
  };
};

type RouteHandler = (req: any, res: any, next?: any) => any;

function createRouteDecorator(method: string) {
  return (path: string): MethodDecorator => {
    return (
      target: any,
      key: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const routes = target.routes || [];
      routes.push({ path, method, key: key.toString() });
      target.routes = routes;

      return descriptor;
    };
  };
}


export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Patch = createRouteDecorator('PATCH')
export const Delete = createRouteDecorator('DELETE')