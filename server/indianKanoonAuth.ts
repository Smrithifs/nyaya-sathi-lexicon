import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface IndianKanoonAuthHeaders {
  'X-Customer': string;
  'X-Message': string;
  'Authorization': string;
}

export class IndianKanoonAuth {
  private privateKey: string;
  private customerEmail: string = 'smritzz0007@gmail.com';

  constructor() {
    this.privateKey = process.env.INDIAN_KANOON_PRIVATE_KEY || '';
    if (!this.privateKey) {
      throw new Error('INDIAN_KANOON_PRIVATE_KEY environment variable is required');
    }
  }

  private generateMessage(url: string): string {
    const timestamp = Date.now().toString();
    const uuid = uuidv4();
    const message = `${uuid}:${timestamp}:${url}`;
    return Buffer.from(message).toString('base64');
  }

  private signMessage(message: string): string {
    try {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(message);
      const signature = sign.sign(this.privateKey, 'base64');
      return signature;
    } catch (error) {
      throw new Error(`Failed to sign message: ${error}`);
    }
  }

  public getAuthHeaders(url: string): IndianKanoonAuthHeaders {
    const message = this.generateMessage(url);
    const signature = this.signMessage(message);
    
    return {
      'X-Customer': this.customerEmail,
      'X-Message': message,
      'Authorization': `HMAC ${signature}`
    };
  }

  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = this.getAuthHeaders(url);
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        ...headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return fetch(url, requestOptions);
  }
}

export const indianKanoonAuth = new IndianKanoonAuth();