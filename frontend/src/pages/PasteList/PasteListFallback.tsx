import { chakra, Icon, VStack } from "@chakra-ui/react"
import { LuFileX } from "react-icons/lu"

export const PasteListFallback = chakra(({...props}) => {
    return <VStack textAlign="center" {...props}>
        <Icon size="md"><LuFileX /></Icon>
        Нет файлов
    </VStack>
})