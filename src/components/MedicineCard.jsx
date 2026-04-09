import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, Minus, ShieldAlert } from 'lucide-react';

export default function MedicineCard({ medicine }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isAdmin } = useAuth();

  const cartItem = cart.find((item) => item.id === medicine.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => addToCart(medicine);
  const handleIncrease = () => updateQuantity(medicine.id, 1);
  const handleDecrease = () => updateQuantity(medicine.id, -1);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl ring-1 ring-gray-200 hover:ring-blue-500/50 transition-all duration-300 overflow-hidden">

      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {medicine.image ? (
          <img
            src={medicine.image}
            alt={medicine.name}
            onClick={handleAdd}
            className="w-full cursor-pointer h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center ring-1 ring-black/5">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                {medicine.name.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {medicine.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm ring-1 ring-black/5">
              {medicine.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between bg-white">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{medicine.name}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{medicine.description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 gap-2">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            ₹{medicine.price}
          </p>

          {isAdmin ? (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-indigo-200">

            </div>
          ) : quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-95 text-sm font-semibold"
              aria-label={`Add ${medicine.name} to cart`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
              <Plus className="w-4 h-4 sm:hidden" />
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 rounded-xl p-1 ring-1 ring-blue-200">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white text-blue-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm ring-1 ring-gray-200 active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm sm:text-base font-bold text-blue-700">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
