import apiClient from './apiClient';

const pillReminderService = {
  createReminder: (reminderData) =>
    apiClient.post('/pill-reminders', reminderData),

  getReminders: () =>
    apiClient.get('/pill-reminders'),

  toggleReminder: (id) =>
    apiClient.patch(`/pill-reminders/${id}/toggle`),

  deleteReminder: (id) =>
    apiClient.delete(`/pill-reminders/${id}`),
};

export default pillReminderService;
