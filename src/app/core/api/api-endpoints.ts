export const API_ENDPOINTS = {
  chanelStudent: {
    register: '/chanelstu/chanesturegister',
    login: '/chanelstu/chanestulogin',
    profile: '/chanelstu/profile',
    forgotPassword: '/chanelstu/forgot-password',
    resetPassword: '/chanelstu/reset-password',
    changePassword: '/chanelstu/change-password',
  },

  schoolPayment: {
    createOrder: '/school-payment/create-order',

    // DB plans ke liye new create-order API
    createDbPlanOrder: '/school-payment/create-db-plan-order',

    verifyPayment: '/school-payment/verify-payment',
    applyCoupon: '/school-payment/apply_coupon',
    history: (userId: number) =>
      `/school-payment/history/${userId}`,
  },

  token: {
    generateTempToken: '/token/generate-token',
  },
} as const;