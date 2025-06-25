import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface IndianKanoonAuthHeaders {
  'X-Customer': string;
  'X-Message': string;
  'Authorization': string;
}

export class IndianKanoonAuth {
  private apiToken: string;
  private privateKey: string;
  private customerEmail: string = 'smritzz0007@gmail.com';

  constructor() {
    // Prefer API Token approach (simpler and more reliable)
    this.apiToken = process.env.INDIAN_KANOON_API_TOKEN || '';
    
    // Fallback to private key approach
    const rawKey = process.env.INDIAN_KANOON_PRIVATE_KEY || '';
    this.privateKey = '';
    
    if (!this.apiToken && !rawKey) {
      console.warn('Neither INDIAN_KANOON_API_TOKEN nor INDIAN_KANOON_PRIVATE_KEY found');
      return;
    }
    
    // Focus on private key authentication as recommended
    if (rawKey) {
      try {
        // Handle different private key formats
        let cleanKey = rawKey.replace(/\\n/g, '\n').trim();
        
        // Handle different PEM formats
        if (!cleanKey.includes('-----BEGIN')) {
          // Try PKCS#8 format first (recommended for modern applications)
          cleanKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey}\n-----END PRIVATE KEY-----`;
        } else if (cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
          // Already in PKCS#1 format, keep as is
        } else if (cleanKey.includes('-----BEGIN PRIVATE KEY-----')) {
          // Already in PKCS#8 format, keep as is  
        }
        
        this.privateKey = cleanKey;
        console.log('Using Indian Kanoon private key authentication');
        
        // Don't test the key here - let it fail at request time if invalid
        
      } catch (error) {
        console.error('Error setting up private key:', error);
        this.privateKey = '';
      }
    }
    
    if (this.apiToken && !this.privateKey) {
      console.log('API Token available but using private key method as recommended');
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
      // Indian Kanoon requires PKCS1_v1_5 with SHA256 hash
      // First decode the base64 message to get the raw bytes
      const messageBytes = Buffer.from(message, 'base64');
      
      // Create SHA256 hash of the message
      const hash = crypto.createHash('sha256');
      hash.update(messageBytes);
      const hashedMessage = hash.digest();
      
      // Sign the hash using RSA with the private key
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(hashedMessage);
      const signature = sign.sign(this.privateKey, 'base64');
      
      return signature;
    } catch (error) {
      console.error('Signing error details:', error);
      throw new Error(`Failed to sign message: ${error}`);
    }
  }

  public getAuthHeaders(url: string): any {
    if (this.privateKey) {
      // Use public-private key authentication as recommended
      const message = this.generateMessage(url);
      const signature = this.signMessage(message);
      
      return {
        'X-Customer': this.customerEmail,
        'X-Message': message,
        'Authorization': `HMAC ${signature}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } else if (this.apiToken) {
      // Fallback to API Token authentication
      return {
        'Authorization': `Token ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } else {
      throw new Error('No authentication method available');
    }
  }

  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = this.getAuthHeaders(url);
    
    const requestOptions: RequestInit = {
      method: 'POST', // Indian Kanoon API requires POST requests
      ...options,
      headers: {
        ...options.headers,
        ...headers
      }
    };

    return fetch(url, requestOptions);
  }
}

export const indianKanoonAuth = new IndianKanoonAuth();