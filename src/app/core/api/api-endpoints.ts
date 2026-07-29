export const API_ENDPOINTS = {
  chanelStudent: {
    register: '/chanelstu/chanesturegister',
    login: '/chanelstu/chanestulogin',
    profile: '/chanelstu/profile',
  },
  schoolPayment: {
    createOrder: '/school-payment/create-order',
    verifyPayment: '/school-payment/verify-payment',
    applyCoupon: '/school-payment/apply_coupon',
    history: (userId: number) => `/school-payment/history/${userId}`,
  },
  token: {
    generateTempToken: '/token/generate-token',
  },
} as const;
