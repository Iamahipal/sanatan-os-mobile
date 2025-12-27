import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

/**
 * Auth hook for Google Sign-In with Supabase
 * Provides user state, loading state, and auth methods
 */
export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => setUser(session?.user ?? null)
        )

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        })
        if (error) console.error('Auth error:', error)
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Sign out error:', error)
    }

    return { user, loading, signIn, signOut }
}
