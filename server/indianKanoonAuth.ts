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
    const rawKey = process.env.INDIAN_KANOON_PRIVATE_KEY || '';
    if (!rawKey) {
      console.warn('INDIAN_KANOON_PRIVATE_KEY not found - Indian Kanoon API will not work');
      this.privateKey = '';
      return;
    }
    
    try {
      // Clean and format the private key
      let cleanKey = rawKey.replace(/\\n/g, '\n').trim();
      
      // Handle different possible formats
      if (!cleanKey.includes('-----BEGIN')) {
        // Try different PEM headers
        if (cleanKey.includes('RSA')) {
          cleanKey = `-----BEGIN RSA PRIVATE KEY-----\n${cleanKey}\n-----END RSA PRIVATE KEY-----`;
        } else {
          cleanKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey}\n-----END PRIVATE KEY-----`;
        }
      }
      
      this.privateKey = cleanKey;
      
      // Test the key format
      const testSign = crypto.createSign('sha256');
      testSign.update('test');
      testSign.sign(this.privateKey, 'base64');
      
    } catch (error) {
      console.error('Invalid private key format:', error);
      this.privateKey = '';
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
      const sign = crypto.createSign('sha256');
      sign.update(message);
      const signature = sign.sign(this.privateKey, 'base64');
      return signature;
    } catch (error) {
      console.error('Private key format:', this.privateKey.substring(0, 100) + '...');
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