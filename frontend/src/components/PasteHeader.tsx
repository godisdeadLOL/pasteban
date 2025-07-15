import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"
import { PasteOverview, PastePublic } from "@/schemas"
import { copyToClipboard, formatTimeAgo } from "@/utils"
import { Box, Stack, Text, Group, IconButton, HStack, Link, Skeleton } from "@chakra-ui/react"
import { LuCopy, LuClock, LuShield, LuKey, LuTimer } from "react-icons/lu"
import { useNavigate } from "react-router"

export const PasteHeaderSkeleton = () => {
	return <Stack gap={2} py={2}>

		<Stack gap={2} sm={{ flexDirection: "row" }}>
			<Skeleton h={4} w={24} />
			<Skeleton h={4} w={16} />
		</Stack>

		<Skeleton h={3} w="full" />

	</Stack>
}

type PasteHeaderProps = {
	pasteData: PasteOverview | PastePublic
}

export const PasteHeader = ({ pasteData }: PasteHeaderProps) => {
	const navigate = useNavigate()
	const accessKey = usePasteAccessKey(pasteData.url)

	return (
		<Stack gap={0}>
			<Stack direction={{ base: "column", sm: "row" }} gap={{ base: 0, sm: 4 }} alignItems={{ base: "start", sm: "center" }}>
				<Group>
					<Link onClick={() => navigate(`/${pasteData.url}`)}> {pasteData.title} </Link>
					{pasteData.is_protected && (accessKey ? <LuKey /> : <LuShield />)}
				</Group>

				<Group gap={1}>
					<Text fontSize={"sm"} color={"GrayText"}>
						{pasteData.url}
					</Text>
					<IconButton onClick={() => copyToClipboard(pasteData.url, "Код скопирован")} rounded={"full"} variant="ghost" size="xs">
						<LuCopy />
					</IconButton>
				</Group>
			</Stack>

			<Group>
				<LuClock color={"GrayText"} />
				<Box textWrap="nowrap" color={"GrayText"} fontSize={"sm"}>
					{formatTimeAgo(pasteData.created_at)}
				</Box>
			</Group>

		</Stack>
	)
}
