import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useMedicines } from '../context/MedicinesContext';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  address: z.string().min(10, { message: 'Please enter a complete address' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Mobile number must be 10 digits' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Pincode must be 6 digits' }),
  paymentMethod: z.enum(['cod', 'card', 'wallet'], { required_error: 'Select payment method' }),
});

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { medicines, updateMedicine } = useMedicines();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = total > 500 ? 0 : 100;
  const tax = total * 0.18;
  const orderTotal = total + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod' },
  });

  const selectedPayment = watch('paymentMethod');

  const finishOrder = async (data) => {
    try {
      await addOrder({
        items: cart,
        total: orderTotal,
        shippingAddress: {
          name: data.name,
          address: data.address,
          mobile: data.mobile,
          pincode: data.pincode,
        },
        paymentMethod: data.paymentMethod,
        userEmail: user.email,
        userId: user.id || user._id,
      });

      clearCart();
      setShowCheckout(false);
      setIsProcessing(false);
      navigate('/orders');
    } catch (error) {
      console.error('Order checkout failed:', error);
      setIsProcessing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setIsProcessing(true);

    if (data.paymentMethod === 'cod') {
      setTimeout(() => finishOrder(data), 1500);
      return;
    }

    const res = await loadRazorpay();

    if (!res) {
      alert("Payment SDK failed to load");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_SbJDzChZ18vIEO",
      amount: Math.round(orderTotal * 100),
      currency: "INR",
      name: "PharmaCare",
      description: "Demo Payment Secure Checkout",
      theme: { color: "#2563eb" },
      handler: function (response) {

        finishOrder(data);
      },
      method: {
        upi: false,
        card: true,
        netbanking: true,
        wallet: true,
        paylater: false,
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      },
      readonly: {
        contact: false,
      },
      prefill: {
        name: data.name,
        email: user.email || "test@example.com",
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 ">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingCart className="w-16 h-16 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added any medicines or health products to your cart yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          Start Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 lg:pb-0 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Your Bag
            </h1>
            <p className="text-gray-500 font-medium">{cart.length} items ready for checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="hidden sm:block text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-4 py-2 rounded-xl"
          >
            Clear All
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <li key={item.id} className="p-4 sm:p-8 flex items-center gap-4 sm:gap-8 hover:bg-blue-50/20 transition-all group">
                    <div className="h-20 w-20 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center shadow-inner relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                          {item.name.charAt(0)}
                        </span>
                      )}
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="pr-2">
                          <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          <p className="mt-2 text-lg sm:text-2xl font-black text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-6 flex items-center justify-between">
                        <div className="flex items-center rounded-xl bg-gray-50 p-1 shadow-inner border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 font-bold text-gray-900 min-w-[2rem] text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={clearCart}
              className="mt-6 sm:hidden w-full text-center text-sm font-bold text-rose-500 hover:bg-rose-50 py-4 border-2 border-dashed border-rose-100 rounded-3xl transition-colors"
            >
              Clear Entire Bag
            </button>
          </div>

          {/* Sticky Checkout Bar / Summary */}
          <div className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0 sticky top-28 mb-20 lg:mb-0">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8">
              <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                <CheckCircle2 className="text-blue-600" size={24} />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <dt className="text-gray-500">Fast Delivery</dt>
                  <dd className="text-gray-900">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <dt className="text-gray-500">Estimated Tax</dt>
                  <dd className="text-gray-900">₹{tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-lg font-bold text-gray-900 uppercase tracking-tight">Total Payment</dt>
                    <dd className="text-3xl font-black text-blue-600">₹{orderTotal.toFixed(2)}</dd>
                  </div>
                </div>
              </div>

              {!showCheckout ? (
                <div className="mt-10">
                  {user ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex items-center justify-center gap-3 rounded-[1.25rem] bg-gray-900 px-8 py-5 text-lg font-bold text-white shadow-xl shadow-gray-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 group"
                    >
                      Process Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                      className="w-full flex items-center justify-center gap-3 rounded-[1.25rem] bg-gray-900 px-8 py-5 text-lg font-bold text-white shadow-xl shadow-gray-200 hover:bg-blue-600 transition-all active:scale-95 group"
                    >
                      Login to Pay
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 rounded-2xl text-blue-800">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-bold">Secure Delivery Information</span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <input
                        {...register('name')}
                        placeholder="Recipient Name"
                        className="w-full rounded-2xl border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      {errors.name && <p className="mt-1.5 px-2 text-[10px] uppercase font-black tracking-wider text-rose-500">{errors.name.message}</p>}
                    </div>

                    <div className="relative group">
                      <input
                        {...register('mobile')}
                        placeholder="Primary Contact Number"
                        className="w-full rounded-2xl border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      {errors.mobile && <p className="mt-1.5 px-2 text-[10px] uppercase font-black tracking-wider text-rose-500">{errors.mobile.message}</p>}
                    </div>

                    <div className="relative group">
                      <textarea
                        {...register('address')}
                        placeholder="Full Shipping Address"
                        rows={3}
                        className="w-full rounded-2xl border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      {errors.address && <p className="mt-1.5 px-2 text-[10px] uppercase font-black tracking-wider text-rose-500">{errors.address.message}</p>}
                    </div>

                    <div className="relative group">
                      <input
                        {...register('pincode')}
                        placeholder="Zip / Pincode"
                        className="w-full rounded-2xl border-gray-100 bg-gray-50 px-5 py-4 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      {errors.pincode && <p className="mt-1.5 px-2 text-[10px] uppercase font-black tracking-wider text-rose-500">{errors.pincode.message}</p>}
                    </div>
                  </div>

                  <div className="pt-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'cod', name: 'COD', icon: <ShieldCheck size={20} /> },
                        { id: 'card', name: 'CARD', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                        { id: 'wallet', name: 'WALLET', icon: <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center font-black text-[10px]">₹</div> }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setValue('paymentMethod', method.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${selectedPayment === method.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner'
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                          {method.icon}
                          <span className="text-[10px] font-black tracking-widest">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-8">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : `Pay ₹${orderTotal.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar for Mobile - Premium Interaction */}
      {!showCheckout && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_40px_-15px_rgba(37,99,235,0.2)]">
          <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Estimated Total</span>
              <span className="text-2xl font-black text-gray-900 leading-none">
                ₹{orderTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="flex-1 bg-blue-600 text-white rounded-[1.25rem] py-4 px-8 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all"
            >
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
