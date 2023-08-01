import { ServerRespond } from './DataStreamer';

export interface Row {
  price_A: number,
  price_B: number,
  lower_bound: number,
  upper_bound: number,
  ratio: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) : Row {
      const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
      const priceDEF = (serverResponds[1].top_ask.price + serverResponds[0].top_bid.price) / 2;

      const raTio = priceABC/priceDEF;
      const upperBound = 1.1;
      const lowerBound = 0.99;
      const timeStamp = (serverResponds[0].timestamp > serverResponds[1].timestamp) ?
                        serverResponds[0].timestamp : serverResponds[1].timestamp;
      const triggerAlert = (raTio > upperBound || raTio < lowerBound) ? raTio : undefined;

      return {
        price_A: priceABC,
        price_B: priceDEF,
        ratio: raTio,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: triggerAlert,
        timestamp: timeStamp,
      };
  }
}
