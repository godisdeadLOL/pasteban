import { PasteOverview, PastePublic } from "@/schemas"
import { copyToClipboard, formatDateTime } from "@/utils"
import { Stack, Text, Group, IconButton, HStack, Link } from "@chakra-ui/react"
import { LuCopy, LuClock, LuShield } from "react-icons/lu"
import { useNavigate } from "react-router"

type PasteHeaderProps = {
	data: PasteOverview | PastePublic
}

export const PasteHeader = ({ data }: PasteHeaderProps) => {
	const navigate = useNavigate()

	return (
		<Stack gap={0}>
			<Stack direction={{ base: "column", sm: "row" }} gap={{ base: 0, sm: 4 }} alignItems={{ base: "start", sm: "center" }}>
				<Group>
					<Link onClick={() => navigate(`/${data.url}`)}> {data.title} </Link>
					{data.is_protected && <LuShield />}
				</Group>

				<Group gap={1}>
					<Text fontSize={"sm"} color={"GrayText"}>
						{data.url}
					</Text>
					<IconButton onClick={() => copyToClipboard(data.url, "Код скопирован")} rounded={"full"} variant="ghost" size="xs">
						<LuCopy />
					</IconButton>
				</Group>
			</Stack>

			<HStack gap={2}>
				<Group>
					<LuClock color={"GrayText"} />
					<Text color={"GrayText"} fontSize={"sm"}>
						{formatDateTime(data.created_at)}
					</Text>
				</Group>
			</HStack>
		</Stack>
	)
}
