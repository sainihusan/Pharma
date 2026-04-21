import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { Package, XCircle, Trash2, Clock, Calendar, CheckCircle, User as UserIcon, Loader2 } from 'lucide-react';

export default function OrderHistory() {
  const { orders, cancelOrder, deleteOrder, updateOrderStatus, acceptOrder, processingOrder } = useOrders();
  const { user, isAdmin } = useAuth();

  const displayOrders = isAdmin
    ? orders
    : orders.filter((o) => o.userEmail === user?.email);

  if (displayOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <Package className="w-16 h-16 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          You haven't placed any orders. Start exploring our pharmacy to find what you need.
        </p>
      </div>
    );
  }

  const isOrderProcessing = (orderId, action) => {
    return processingOrder?.id === orderId && (action ? processingOrder?.action === action : true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 ">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-10">
          {isAdmin ? 'Management: All Orders' : 'Order History'}
        </h1>

        <div className="space-y-6">
          {displayOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><Calendar size={14} /> Order Placed</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment</p>
                    <p className="font-semibold text-gray-900 uppercase text-xs tracking-wider bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block">
                      {order.paymentMethod || 'COD'}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 border-gray-200 w-full sm:w-auto">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><UserIcon size={14} /> Customer</p>
                      <p className="font-semibold text-gray-900 truncate max-w-[250px]">{order.userEmail}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-700'
                      : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Accepted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {order.status === 'Cancelled' && <XCircle size={14} />}
                    {order.status === 'Delivered' && <CheckCircle size={14} />}
                    {order.status === 'Accepted' && <CheckCircle size={14} />}
                    {order.status === 'Pending' && <Clock size={14} />}
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <li key={index} className="py-6 flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-100 flex items-center justify-center">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50/50 p-4 sm:px-6 flex justify-end gap-3 border-t border-gray-100">
                {isAdmin && order.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => acceptOrder(order.id)}
                      disabled={isOrderProcessing(order.id)}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                      {isOrderProcessing(order.id, 'accept') ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      {isOrderProcessing(order.id, 'accept') ? 'Accepting...' : 'Accept Order'}
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      disabled={isOrderProcessing(order.id)}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] justify-center"
                    >
                      {isOrderProcessing(order.id, 'delivered') ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      {isOrderProcessing(order.id, 'delivered') ? 'Updating...' : 'Mark as Delivered'}
                    </button>
                  </>
                )}
                {isAdmin && order.status === 'Accepted' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    disabled={isOrderProcessing(order.id)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] justify-center"
                  >
                    {isOrderProcessing(order.id, 'delivered') ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {isOrderProcessing(order.id, 'delivered') ? 'Updating...' : 'Mark as Delivered'}
                  </button>
                )}
                {(order.status === 'Pending' || order.status === 'Accepted') && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    disabled={isOrderProcessing(order.id)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px] justify-center"
                  >
                    {isOrderProcessing(order.id, 'cancel') ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {isOrderProcessing(order.id, 'cancel') ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
