import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ordersService from '../api/ordersService';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      await ordersService.updateOrderStatus(id, { status: 'Cancelled' });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptOrder = async (id) => {
    setIsLoading(true);
    try {
      await ordersService.updateOrderStatus(id, { status: 'Accepted', acceptedByAdmin: true });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to accept order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    setIsLoading(true);
    try {
      await ordersService.deleteOrder(id);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    setIsLoading(true);
    try {
      await ordersService.updateOrderStatus(id, { status: newStatus });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrdersContext.Provider
      value={{ 
        orders, 
        isLoading, 
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
