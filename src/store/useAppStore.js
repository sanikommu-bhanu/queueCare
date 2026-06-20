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

      setUser: (user, authToken) => set({ user, authToken }),
      logout: () => set({ user:null, authToken:null, currentToken:null }),

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

      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    {
      name: 'queuecare-v1',
      partialize: (s) => ({
        user: s.user,
        authToken: s.authToken,
        tokenHistory: s.tokenHistory,
        notifications: s.notifications,
      }),
    }
  )
);
