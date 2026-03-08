import { Service } from '../../../generated/prisma/client.js';

export class ServiceCalculator {
  constructor(private readonly services: Service[]) {}

  getTotalPrice(): number {
    return this.services.reduce((sum, s) => sum + s.price, 0);
  }

  getAveragePrice(): number {
    if (this.services.length === 0) return 0;
    return this.getTotalPrice() / this.services.length;
  }

  getServiceCount(): number {
    return this.services.length;
  }

  getSummary() {
    return {
      totalServices: this.getServiceCount(),
      totalPrice: this.getTotalPrice(),
      averagePrice: this.getAveragePrice(),
    };
  }
}
