import { useEffect, useState } from "preact/hooks"

export const useLocalStorage = (key: string, defaultValue: string | undefined = undefined) => {
    const [value, setValue] = useState(() => {
        return localStorage.getItem(key) ?? defaultValue
    })

    useEffect(() => {
        if (!value) localStorage.removeItem(key)
        else localStorage.setItem(key, value)

        window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, value } }));
    }, [value])

    useEffect(() => {
        const handleStorageChange = (e: Event) => {
            const event = e as CustomEvent;
            if (event.detail?.key === key) {
                const value = event.detail?.value

                if (!value) localStorage.removeItem(key)
                else localStorage.setItem(key, value)
            }
        };

        window.addEventListener('local-storage', handleStorageChange);
        return () => window.removeEventListener('local-storage', handleStorageChange);
    }, [])

    return [value, setValue] as const;
}