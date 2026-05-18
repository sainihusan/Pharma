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
import LoadingButton from '../components/LoadingButton';

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
    <div className="bg-gray-50/50 min-h-screen py-6 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop" className="lg:hidden p-2 rounded-full bg-white shadow-sm border border-gray-100">
            <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
            Shopping Cart <span className="text-blue-600 font-medium">({cart.length})</span>
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <li key={item.id} className="p-4 sm:p-8 flex items-center gap-4 sm:gap-8 hover:bg-gray-50/20 transition-colors group">
                    {/* Visual Container */}
                    <div className="h-20 w-20 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 relative shadow-inner">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-2xl font-black text-blue-600">{item.name.charAt(0)}</span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                        {/* Name */}
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="hidden sm:block mt-1 text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        </div>

                        {/* Center Actions - Moved here for mobile flow */}
                        <div className="flex items-center gap-4 sm:gap-6 justify-around">
                          <div className="flex items-center bg-gray-100/80 p-0.5 sm:p-1 rounded-xl shadow-inner border border-gray-200/50">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-black text-xs sm:text-sm"
                            >
                              -
                            </button>
                            <span className="px-2 sm:px-3 text-xs sm:text-sm font-black text-gray-900 min-w-[1.5rem] sm:min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all font-black text-xs sm:text-sm"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Price - Always last */}
                        <p className="text-lg sm:text-2xl font-black text-gray-900 sm:text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
              <Link to="/shop" className="text-sm font-bold text-blue-600 hover:underline">← Continue Shopping</Link>
              <button
                onClick={clearCart}
                className="text-xs font-black text-gray-400 hover:text-rose-500 transition-all uppercase tracking-widest"
              >
                Clear entire bag
              </button>
            </div>
          </div>

          {/* Improved Summary Card */}
          <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0 sticky top-28">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Order Total
                <div className="h-1 flex-1 bg-gray-50 rounded-full ml-2" />
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-gray-500 font-medium tracking-wide">Basket Subtotal</dt>
                  <dd className="font-bold text-gray-900 font-mono">₹{total.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-gray-500 font-medium tracking-wide">Shipping & Handling</dt>
                  <dd className="font-bold text-gray-900 font-mono">
                    {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm pb-4 border-b border-dashed border-gray-200">
                  <dt className="text-gray-500 font-medium tracking-wide">Applied Tax (GST 18%)</dt>
                  <dd className="font-bold text-gray-900 font-mono">₹{tax.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between py-2">
                  <dt className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Grand Total</dt>
                  <dd className="text-3xl font-black text-gray-900 italic">₹{orderTotal.toFixed(2)}</dd>
                </div>
              </div>

              {!showCheckout ? (
                <div className="mt-8">
                  {user ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-5 text-lg font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all group"
                    >
                      Process Payment
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-5 text-lg font-black text-white shadow-xl hover:bg-black transition-all group"
                    >
                      Unlock Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <ShieldCheck className="text-blue-600" size={24} />
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-widest leading-none">Safe & Secure<br />Checkout</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    {[
                      { name: 'name', placeholder: 'Full Name' },
                      { name: 'mobile', placeholder: 'Mobile Contact' },
                      { name: 'pincode', placeholder: 'Postal Pincode' }
                    ].map((field) => (
                      <div key={field.name}>
                        <input
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-3 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                        {errors[field.name] && <p className="mt-1 text-[10px] uppercase font-black text-rose-500 tracking-wider pl-1">{errors[field.name].message}</p>}
                      </div>
                    ))}
                    <div>
                      <textarea
                        {...register('address')}
                        placeholder="Street Address, Landmark, etc."
                        rows={2}
                        className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-3 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      {errors.address && <p className="mt-1 text-[10px] uppercase font-black text-rose-500 tracking-wider pl-1">{errors.address.message}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Transfer Strategy</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['cod', 'card', 'wallet'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setValue('paymentMethod', method)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1.5 ${selectedPayment === method
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner scale-95'
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                          {method === 'cod' && <ShieldCheck size={18} />}
                          {method === 'card' && <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                          {method === 'wallet' && <div className="w-[18px] h-[18px] rounded-full border-2 border-current flex items-center justify-center font-black text-[9px]">₹</div>}
                          <span className="text-[9px] font-black tracking-tighter uppercase">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 rounded-2xl px-4 py-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <LoadingButton
                      type="submit"
                      loading={isProcessing}
                      loadingText="Verifying..."
                      className="flex-[2] rounded-2xl bg-blue-600 px-4 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-blue-700"
                    >
                      Pay ₹{orderTotal.toFixed(2)}
                    </LoadingButton>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>PCI-DSS Validated Payment Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}