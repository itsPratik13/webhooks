interface Window {
    Clerk?: {
      load?: () => Promise<void>;
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }