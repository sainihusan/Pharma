import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Paper, Typography, Divider, Grid, Skeleton, CircularProgress
} from '@mui/material';
import { 
  User as UserIcon, Clock, Bell, BellOff, Plus, Trash2, CheckCircle2, 
  Sparkles, Activity, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import pillReminderService from '../api/pillReminderService';
import { motion, AnimatePresence } from 'framer-motion';

// ----------------------------------------------------------------------
// High-Fidelity Audio Alert Synthesis (Web Audio API)
// Synthesizes a high-end, premium medical alert tone on the fly.
// ----------------------------------------------------------------------
const playAlarmTone = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
    osc2.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.3); // E4
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.error("Audio synthesis blocked/failed:", e);
  }
};

const playSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.2); // C6
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'scheduler'
  
  // Profile State
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  // Scheduler State
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [activeAlert, setActiveAlert] = useState(null); // Active reminder trigger overlay
  const alertIntervalRef = useRef(null);
  
  // Add Dosage Form State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState('Daily');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // ----------------------------------------------------------------------
  // Fetch Pill Reminders from Backend Database
  // ----------------------------------------------------------------------
  const fetchReminders = async () => {
    try {
      setRemindersLoading(true);
      const res = await pillReminderService.getReminders();
      // apiClient intercepts and strips response wrapping, handling fallbacks:
      const data = res.data || res || [];
      const mapped = data.map(item => ({
        ...item,
        id: item._id || item.id,
      }));
      setReminders(mapped);
    } catch (err) {
      console.error("Failed to fetch reminders from backend:", err);
    } finally {
      setRemindersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  // ----------------------------------------------------------------------
  // Fetch user profile data
  // ----------------------------------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authService.getMe();
        if (res) {
          const fetched = res.data?.user || res.data || res.user || res;
          setProfileData(fetched);
        }
      } catch (error) {
        setProfileData(user || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // ----------------------------------------------------------------------
  // Notification API Handling
  // ----------------------------------------------------------------------
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support alerts.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        playSuccessChime();
        
        // Show permission-granted confirmation via Service Worker if available
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if (registration) {
            registration.showNotification("🔔 Reminders Enabled!", {
              body: "PharmaCare will now trigger notifications for your scheduled doses.",
              icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
              badge: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
            });
            return;
          }
        }
        
        // Fallback for browsers without service worker active
        new Notification("🔔 Reminders Enabled!", {
          body: "PharmaCare will now trigger notifications for your scheduled doses.",
          icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
        });
      }
    } catch (e) {
      console.error("Permission request rejected:", e);
    }
  };

  const triggerPushNotification = async (name, dose, remNotes) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `💊 Dose Alert: ${name}`;
      const options = {
        body: `It's time to take your ${dose}.${remNotes ? `\nInstructions: "${remNotes}"` : ""}`,
        icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
        badge: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
        vibrate: [300, 100, 300, 100, 400],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 'pharma-alarm'
        },
        actions: [
          { 
            action: 'taken', 
            title: 'Taken 💊', 
            icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' 
          },
          { 
            action: 'close', 
            title: 'Snooze 🔔', 
            icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' 
          }
        ],
        tag: 'pill-reminder-alert',
        renotify: true,
        requireInteraction: true
      };

      // Trigger via Service Worker if available (required for mobile background support)
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration) {
            await registration.showNotification(title, options);
            return;
          }
        } catch (swErr) {
          console.warn("Service Worker notification trigger failed, falling back:", swErr);
        }
      }

      // Legacy fallback (Desktop only, doesn't support action buttons)
      new Notification(title, {
        body: options.body,
        icon: options.icon,
        vibrate: options.vibrate,
        requireInteraction: options.requireInteraction
      });
    }
  };

  // ----------------------------------------------------------------------
  // Real-Time Scheduler Engine (Check Alarms every 5 seconds)
  // Keeps alarms in-memory for live alerts.
  // ----------------------------------------------------------------------
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${hours}:${minutes}`;

      setReminders(prevReminders => {
        let isUpdated = false;
        const next = prevReminders.map(rem => {
          if (
            rem.isActive &&
            rem.time === currentTimeString &&
            rem.lastTriggered !== currentTimeString
          ) {
            isUpdated = true;
            
            // Trigger Synth Chime
            playAlarmTone();
            
            // Trigger Native Push Notification
            triggerPushNotification(rem.medName, rem.dosage, rem.notes);
            
            // Open Interactive on-screen alarm HUD
            setActiveAlert({
              ...rem,
              triggeredAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            return { ...rem, lastTriggered: currentTimeString };
          }
          return rem;
        });

        return next;
      });
    };

    const interval = setInterval(checkAlarms, 5000);
    return () => clearInterval(interval);
  }, []);

  // Repeat alarm tone if overlay is active
  useEffect(() => {
    if (activeAlert) {
      alertIntervalRef.current = setInterval(() => {
        playAlarmTone();
      }, 4000);
    } else {
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current);
      }
    }
    return () => {
      if (alertIntervalRef.current) clearInterval(alertIntervalRef.current);
    };
  }, [activeAlert]);

  // ----------------------------------------------------------------------
  // Database API Handlers
  // ----------------------------------------------------------------------
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medName.trim()) {
      setFormError('Please enter a medicine name');
      return;
    }
    if (!dosage.trim()) {
      setFormError('Please specify the dosage quantity');
      return;
    }

    try {
      setFormError('');
      const payload = {
        medName: medName.trim(),
        dosage: dosage.trim(),
        time,
        frequency,
        notes: notes.trim(),
      };

      const res = await pillReminderService.createReminder(payload);
      const created = res.data || res;
      const mapped = {
        ...created,
        id: created._id || created.id,
      };

      setReminders(prev => [mapped, ...prev]);
      playSuccessChime();

      // Reset Form
      setMedName('');
      setDosage('');
      setTime('08:00');
      setFrequency('Daily');
      setNotes('');
    } catch (err) {
      console.error("Save reminder backend error:", err);
      setFormError(err.message || err || 'Failed to save reminder to backend database.');
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await pillReminderService.deleteReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
      playSuccessChime();
    } catch (err) {
      console.error("Failed to delete reminder from database:", err);
      alert("Failed to delete reminder: " + (err.message || err));
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      const res = await pillReminderService.toggleReminder(id);
      const updated = res.data || res;
      setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: updated.isActive, lastTriggered: '' } : r));
    } catch (err) {
      console.error("Failed to toggle reminder status in backend:", err);
      alert("Failed to toggle reminder: " + (err.message || err));
    }
  };

  const handleDismissAlert = () => {
    setActiveAlert(null);
    playSuccessChime();
  };

  // Profile Information Row
  const InfoRow = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="body1" fontWeight={500} color={value ? 'text.primary' : 'text.disabled'}>
          {value || 'Not provided'}
        </Typography>
      </Grid>
    </Grid>
  );

  // Profile Loading State
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: '1px solid', borderColor: 'grey.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 3 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={32} />
              <Skeleton width="30%" />
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><Skeleton width="60%" /></Grid>
                <Grid item xs={12} sm={8}><Skeleton width="80%" height={24} /></Grid>
              </Grid>
              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            </Box>
          ))}
        </Paper>
      </Container>
    );
  }

  const displayUsername = profileData.username || user?.username || profileData.fullName || 'User';
  const displayEmail = profileData.email || user?.email;
  const displayDob = profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : '';
  const displayGender = profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : '';

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 relative">
      
      {/* ----------------------------------------------------------------------
          REAL-TIME ALARM HUD OVERLAY MODAL (Framer Motion)
          ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] border-4 border-rose-500/30 overflow-hidden shadow-2xl p-8 text-center relative"
            >
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 bg-rose-500/10 rounded-full animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Clock className="w-10 h-10 text-white animate-spin-slow" />
                </div>
              </div>

              <span className="text-[10px] font-black text-rose-600 tracking-[0.25em] uppercase bg-rose-50 px-4 py-1.5 rounded-full inline-block mb-3 border border-rose-100">
                Pill Intake Alert - {activeAlert.triggeredAt}
              </span>

              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                {activeAlert.medName}
              </h2>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400 w-16">Dose:</span>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{activeAlert.dosage}</span>
                </div>
                {activeAlert.notes && (
                  <div className="flex items-start gap-2 pt-2 border-t border-dashed border-gray-200">
                    <span className="text-xs font-bold text-gray-400 w-16">Note:</span>
                    <span className="text-xs font-bold text-gray-700 italic">"{activeAlert.notes}"</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={handleDismissAlert}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-500/30 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  I've Taken My Medicine
                </button>
                <button
                  onClick={() => setActiveAlert(null)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-bold transition-all text-xs"
                >
                  Snooze / Dismiss Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Container maxWidth="lg">
        
        {/* Page Headings */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              User <span className="text-blue-600">Hub</span>
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-1">Manage profile, schedules, and active health tools</p>
          </div>

          <div className="flex bg-white border border-gray-200 p-1.5 rounded-2xl shadow-sm self-start">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserIcon size={14} /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'scheduler'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Clock size={14} /> Pill Scheduler
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------------
            TAB 1: ACCOUNT DETAILS PANEL
            ---------------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 6, 
                  border: '1px solid', 
                  borderColor: 'grey.200', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                  background: '#ffffff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'primary.50', display: 'flex' }}>
                    <UserIcon size={28} className="text-blue-600" />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="grey.900">
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Details associated with your registered customer profile
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InfoRow label="Username" value={displayUsername} />
                  <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                  <InfoRow label="Email Address" value={displayEmail} />
                  <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                  <InfoRow label="Date of Birth" value={displayDob} />
                  <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                  <InfoRow label="Gender" value={displayGender} />
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* ----------------------------------------------------------------------
              TAB 2: PILL DOSAGE SCHEDULER & WEB PUSH PORTAL (DATABASE BACKED)
              ---------------------------------------------------------------------- */}
          {activeTab === 'scheduler' && (
            <motion.div
              key="scheduler-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* LEFT COLUMN: ADD REMINDER FORM */}
              <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Add New Dosage</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Program daily recurring alerts</p>
                  </div>
                </div>

                <form onSubmit={handleAddReminder} className="space-y-4">
                  {formError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                      <ShieldAlert size={16} />
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol / Insulin"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Dosage</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 Tablet"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Intake Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer"
                    >
                      <option value="Daily">Everyday (Daily)</option>
                      <option value="Alternate">Alternate Days</option>
                      <option value="Weekly">Once a Week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 pl-1">Doctor Instructions / Notes</label>
                    <textarea
                      placeholder="e.g. Take right after dinner"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-sm font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-6"
                  >
                    <Plus size={16} /> Save Reminder
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: ACTIVE REMINDERS HUD */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* System Alerts Banner */}
                <div className={`p-5 rounded-[2rem] border transition-all ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-50/50 border-emerald-100/80 flex items-center justify-between gap-4'
                    : 'bg-amber-50 border-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      notificationPermission === 'granted' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {notificationPermission === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        {notificationPermission === 'granted' ? 'Desktop Alerts Active' : 'Desktop Push Alerts Off'}
                      </h3>
                      <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                        {notificationPermission === 'granted' 
                          ? 'Real-time alert prompts will show on screen.' 
                          : 'Turn on notifications to never miss dosage timings.'}
                      </p>
                    </div>
                  </div>
                  {notificationPermission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-4 py-2 bg-amber-600 text-white text-xs font-black rounded-xl hover:bg-amber-700 shadow-sm active:scale-95 transition-all self-start sm:self-center shrink-0"
                    >
                      Enable Now
                    </button>
                  )}
                </div>

                {/* Reminders List Container */}
                <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm relative min-h-[300px]">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="text-blue-500" size={18} />
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Active Reminders</h3>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {reminders.filter(r => r.isActive).length} Running
                    </span>
                  </div>

                  {remindersLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-[2.5rem] z-10">
                      <CircularProgress size={40} className="text-blue-600" />
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    {reminders.length > 0 ? (
                      reminders.map((rem) => (
                        <div
                          key={rem.id}
                          className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                            rem.isActive
                              ? 'bg-white border-gray-200/80 shadow-sm hover:border-blue-200'
                              : 'bg-gray-50/50 border-gray-100 opacity-60'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleReminder(rem.id)}
                            className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                              rem.isActive 
                                ? 'bg-blue-50 text-blue-600 shadow-inner' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Clock size={18} className={rem.isActive ? 'animate-pulse' : ''} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <h4 className="text-sm font-extrabold text-gray-900 truncate">{rem.medName}</h4>
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">{rem.frequency}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-400">
                              <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">{rem.time}</span>
                              <span>•</span>
                              <span className="text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded">{rem.dosage}</span>
                            </div>

                            {rem.notes && (
                              <p className="mt-2 text-xs text-gray-400 font-medium italic">
                                "{rem.notes}"
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteReminder(rem.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            aria-label="Remove reminder"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-sm font-bold text-gray-800">No scheduled reminders</h4>
                        <p className="text-xs text-gray-400 mt-1">Input dosages in the left panel to configure reminders in the database.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </Container>
    </div>
  );
}
