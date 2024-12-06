import { create } from "zustand";

export const authStore = create((set) => ({
    user: null,
    playerStats: null,
    setUser: (user) => {
        try {
            const resp = api.get("/user/user-profile")
            set(resp.data )
        } catch (error) {
            
        }
        
    },
    updatePlayerStats: (stats) => set({ playerStats: stats }),
    logout: () => set({ user: null })


}))