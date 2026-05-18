import apiClient from './apiClient';

const ordersService = {
  createOrder: (orderData) =>
    apiClient.post('/orders', orderData),

  getOrders: () =>
    apiClient.get('/orders'),

  updateOrderStatus: (id, statusData) =>
    apiClient.patch(`/orders/${id}/status`, statusData),

  deleteOrder: (id) =>
    apiClient.delete(`/orders/${id}`),
};

export default ordersService;
