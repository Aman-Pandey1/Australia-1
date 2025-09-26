import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark') return stored
        // Prefer dark by default per current design
        return 'dark'
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
        const root = document.documentElement
        root.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

    const value = useMemo(() => ({ theme, toggleTheme }), [theme])
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext)
}

