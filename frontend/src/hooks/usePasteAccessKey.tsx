import { useLocalStorage } from "@/hooks/useLocalStorage"

export const usePasteAccessKey = (pasteUrl: string) => {
    const [key] = useLocalStorage(`key_${pasteUrl}`)
    const [accessToken] = useLocalStorage("access_token")
    return accessToken || key
}