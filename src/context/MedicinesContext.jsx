import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MedicinesContext = createContext();

export const MedicinesProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchMedicines = async () => {
    try {
      setLoading(true);

      const requestHeaders = {
        'accept': '*/*'
      };

      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${API_BASE}/products`, {
        headers: requestHeaders
      });

      const data = res.data;
      const productsList = Array.isArray(data) ? data : data.products || data.data || [];

      const allowedCategories = ['medicine', 'medicines', 'baby care', 'skincare', 'daily health', 'laboratory'];

      // Filter to include all specified categories before mapping
      const mapped = productsList
        .filter(p => {
          const cat = p.category ? p.category.toLowerCase() : '';
          return allowedCategories.includes(cat);
        })
        .map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.imageLink || p.image,
        }));

      setMedicines(mapped);
    } catch (err) {
      console.error("Backend fetch failed. No local fallback provided:", err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [token]);

  const addMedicine = async (med) => {
    try {
      const payload = {
        name: med.name,
        description: med.description || '',
        price: Number(med.price),
        imageLink: med.image || '',
        category: med.category || ''
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
      };

      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      // FIRST API: POST /api/products
      const res = await axios.post(`${API_BASE}/products`, payload, {
        headers: requestHeaders
      });

      const createdData = res.data;
      const createdProduct = createdData.product || createdData.data || createdData;

      const newBackendMed = {
        ...med,
        id: createdProduct._id || createdProduct.id || Date.now().toString(),
        image: createdProduct.imageLink || createdProduct.image || med.image
      };

      setMedicines((prev) => [...prev, newBackendMed]);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to backend: " + err.message);
    }
  };

  const updateMedicine = (id, updatedMed) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedMed } : med))
    );
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  return (
    <MedicinesContext.Provider
      value={{ medicines, loading, addMedicine, updateMedicine, deleteMedicine }}
    >
      {children}
    </MedicinesContext.Provider>
  );
};

export const useMedicines = () => useContext(MedicinesContext);
