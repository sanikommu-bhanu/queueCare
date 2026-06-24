'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,
      currentToken: null,
      tokenHistory: [],
      notifications: [],
      darkMode: false,
      notificationPrefs: { push: true, voice: true, sms: false },
      userRating: 0,

      setUser: (user, authToken) => set({ user, authToken }),
      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
      logout: () => set({ user: null, authToken: null, currentToken: null }),

      setCurrentToken: (token) => set({ currentToken: token }),
      clearCurrentToken: () => set({ currentToken: null }),
      updateCurrentToken: (updates) =>
        set((s) => ({ currentToken: s.currentToken ? { ...s.currentToken, ...updates } : null })),

      addTokenToHistory: (token) =>
        set((s) => ({
          tokenHistory: [token, ...s.tokenHistory.filter(t => t.id !== token.id)].slice(0, 50),
        })),

      pushNotification: (notif) =>
        set((s) => ({
          notifications: [
            { ...notif, id: Date.now(), read: false, time: new Date().toISOString() },
            ...s.notifications,
          ].slice(0, 100),
        })),

      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),

      clearNotifications: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter(n => !n.read).length,

      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next);
          }
          return { darkMode: next };
        }),

      updateNotificationPrefs: (updates) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...updates } })),

      setUserRating: (rating) => set({ userRating: rating }),
    }),
    {
      name: 'queuecare-v1',
      partialize: (s) => ({
        user: s.user,
        authToken: s.authToken,
        tokenHistory: s.tokenHistory,
        notifications: s.notifications,
        darkMode: s.darkMode,
        notificationPrefs: s.notificationPrefs,
        userRating: s.userRating,
      }),
    }
  )
);
