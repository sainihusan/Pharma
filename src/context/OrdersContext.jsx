import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ordersService from '../api/ordersService';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await ordersService.getOrders();
      // Ensure we're setting an array, handling different possible response structures
      const ordersData = response.data || response;
      const list = Array.isArray(ordersData) ? ordersData : [];
      setOrders(list.map(o => ({
        ...o,
        id: o._id || o.id
      })));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (orderData) => {
    setIsLoading(true);
    try {
      await ordersService.createOrder(orderData);
      await fetchOrders(); // Refresh orders after adding
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    setProcessingOrder({ id, action: 'cancel' });
    try {
      await ordersService.updateOrderStatus(id, { status: 'Cancelled' });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    } finally {
      setProcessingOrder(null);
    }
  };

  const acceptOrder = async (id) => {
    setProcessingOrder({ id, action: 'accept' });
    try {
      await ordersService.updateOrderStatus(id, { status: 'Accepted', acceptedByAdmin: true });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to accept order:', error);
      throw error;
    } finally {
      setProcessingOrder(null);
    }
  };

  const deleteOrder = async (id) => {
    setProcessingOrder({ id, action: 'delete' });
    try {
      await ordersService.deleteOrder(id);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    } finally {
      setProcessingOrder(null);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    setProcessingOrder({ id, action: newStatus.toLowerCase() });
    try {
      await ordersService.updateOrderStatus(id, { status: newStatus });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    } finally {
      setProcessingOrder(null);
    }
  };

  return (
    <OrdersContext.Provider
      value={{ 
        orders, 
        isLoading, 
        processingOrder,
        addOrder, 
        cancelOrder, 
        deleteOrder, 
        updateOrderStatus, 
        acceptOrder,
        fetchOrders 
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
