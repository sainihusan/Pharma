import apiClient from './apiClient';

const ordersService = {
  createOrder: (orderData) =>
    apiClient('/orders', { method: 'POST', body: orderData }),

  getOrders: () =>
    apiClient('/orders', { method: 'GET' }),

  updateOrderStatus: (id, statusData) =>
    apiClient(`/orders/${id}/status`, { method: 'PATCH', body: statusData }),

  deleteOrder: (id) =>
    apiClient(`/orders/${id}`, { method: 'DELETE' }),
};

export default ordersService;
