import { PasswordInput } from "@/components/ui/password-input"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Box, Button, Stack } from "@chakra-ui/react"
import { useState } from "preact/hooks"

export const Auth = () => {
    const [accessToken, setAccessToken] = useLocalStorage("access_token")
    const [value, setValue] = useState("")

    return <Stack mt={8} gap={4} maxW="md" mx="auto">
        {
            accessToken ?
                <>
                    <Box textAlign="center" h={8}>Токен введен</Box>
                    <Button onClick={() =>{ setAccessToken(undefined); setValue("")}} colorPalette="red">Очистить</Button>
                </> :
                <>
                    <PasswordInput onChange={(e: any) => setValue(e.target.value)} placeholder="Введите токен" />
                    <Button onClick={() => { if (value) setAccessToken(value) }} colorPalette="green">Подтвердить</Button>
                </>

        }
    </Stack>
}