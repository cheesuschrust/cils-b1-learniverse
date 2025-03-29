
class ServiceFactory {
  private services: Map<string, any> = new Map();

  register(name: string, service: any): void {
    this.services.set(name, service);
  }

  getService(name: string): any {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not registered`);
    }
    return this.services.get(name);
  }
  
  // For backward compatibility
  get(name: string): any {
    return this.getService(name);
  }
}

export const serviceFactory = new ServiceFactory();

export default serviceFactory;
