import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  async getNetworkStatus(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
  checkNetworkStausChanged() {
     const logNetworkStatusChange = Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });
    return logNetworkStatusChange;

  }
}
