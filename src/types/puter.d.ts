
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string }) => Promise<string | {
          message?: string;
          toString?: () => string;
          [key: string]: any;
        }>;
      };
    };
  }
}

export {};
