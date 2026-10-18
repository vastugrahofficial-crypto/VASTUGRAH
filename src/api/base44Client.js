// Compatibility stub for any legacy references
export const base44 = {
  auth: {
    loginViaEmailPassword: async () => ({ user: {} }),
    loginWithProvider: () => { },
    register: async () => ({ user: {} }),
    verifyOtp: async () => ({ access_token: "mock_token" }),
    setToken: () => { },
    resendOtp: async () => { },
    resetPasswordRequest: async () => { },
    resetPassword: async () => { },
    isAuthenticated: () => true,
  },
  entities: {
    BirthProfile: {
      filter: async () => ({ items: [] }),
      create: async (data) => data,
    },
  },
  functions: {
    invoke: async (name, params) => ({ data: {} }),
  },
};

export default base44;
