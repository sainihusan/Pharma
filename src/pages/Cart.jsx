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
    <div className="bg-gray-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-10">
          Shopping Cart
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 flex items-center justify-center shadow-inner relative group">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                          {item.name.charAt(0)}
                        </span>
                      )}

                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between sm:grid sm:grid-cols-2 lg:block xl:grid">
                        <div className="pr-6">
                          <h3 className="text-xl font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        </div>

                        <div className="text-right sm:text-left lg:text-right sm:mt-0 mt-2">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400 font-medium">
                              ₹{item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors font-medium text-lg active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:bg-white"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900 border-x border-gray-200 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors font-medium text-lg active:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={18} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors px-4 py-2"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0 sticky top-28">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="flow-root">
                <dl className="-my-4 divide-y divide-gray-100 text-sm">
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">₹{total.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toFixed(2)}`}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600 flex items-center gap-2">
                      GST (18%)
                    </dt>
                    <dd className="font-medium text-gray-900">₹{tax.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between py-6">
                    <dt className="text-base font-bold text-gray-900">Order total</dt>
                    <dd className="text-2xl font-black text-gray-900">₹{orderTotal.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              {!showCheckout ? (
                <div className="mt-8">
                  {user ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-transparent bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-transparent bg-gray-900 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-gray-800 transition-all group"
                    >
                      Login to Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="font-bold text-gray-900 border-t pt-4">Delivery Details</h3>

                  <div>
                    <input
                      {...register('name')}
                      placeholder="Full Name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <input
                      {...register('mobile')}
                      placeholder="Mobile Number (10 digits)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.mobile && <p className="mt-1 text-xs text-rose-500">{errors.mobile.message}</p>}
                  </div>

                  <div>
                    <textarea
                      {...register('address')}
                      placeholder="Complete Address"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address.message}</p>}
                  </div>

                  <div>
                    <input
                      {...register('pincode')}
                      placeholder="Pincode (6 digits)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.pincode && <p className="mt-1 text-xs text-rose-500">{errors.pincode.message}</p>}
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('paymentMethod', 'cod')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedPayment === 'cod'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                          }`}
                      >
                        <ShieldCheck size={24} className={selectedPayment === 'cod' ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="text-[10px] font-bold mt-1 uppercase">COD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue('paymentMethod', 'card')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedPayment === 'card'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                          }`}
                      >
                        <svg className={`w-6 h-6 ${selectedPayment === 'card' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-[10px] font-bold mt-1 uppercase text-center">Card<br />(Razorpay)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue('paymentMethod', 'wallet')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedPayment === 'wallet'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                          }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${selectedPayment === 'wallet' ? 'border-blue-600 text-blue-600' : 'border-gray-400 text-gray-400'}`}>₹</div>
                        <span className="text-[10px] font-bold mt-1 uppercase text-center">Wallet</span>
                      </button>
                    </div>
                    {errors.paymentMethod && <p className="mt-1 text-xs text-rose-500">{errors.paymentMethod.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex gap-2 items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          Pay ₹{orderTotal.toFixed(2)}
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>100% Secure Payment Guarantee via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}