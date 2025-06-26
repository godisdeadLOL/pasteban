import { Stack, InputGroup, CloseButton, Input, For, Box, Flex, Heading } from "@chakra-ui/react"
import { LuArrowRight, LuSearch } from "react-icons/lu"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { useQuery } from "@tanstack/react-query"
import { PasteHeader } from "@/components/PasteHeader"
import { useNavigate } from "react-router"
import { PendingStatus } from "@/components/PendingStatus"
import { useEffect, useState } from "preact/hooks"
import { handleResponse } from "@/utils"
import { PasteOverview } from "@/schemas"

const PasteItem = ({ index, data }: any) => {
	const navigate = useNavigate()

	return (
		<Box borderBottom={1} borderStyle="solid" borderColor={"border"} py={4} _first={{ pt: 0 }}>
			<Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
				<Box w={16} textAlign={"center"} display={{ base: "none", md: "flex" }}>
					{index}.
				</Box>

				<PasteHeader data={data} />

				<Box mx={"auto"} />
				<AdaptiveButton onClick={() => navigate(`/${data.url}`)} label="Подробнее" icon={<LuArrowRight />} />
			</Flex>
		</Box>
	)
}

export const PasteList = () => {
	const [search, setSearch] = useState("")

	const { isPending, error, data } = useQuery<PasteOverview[]>({
		queryKey: ["pastes", search],
		queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/pastes?` + new URLSearchParams({ query: search }).toString()).then((res) => handleResponse(res)),
	})

	useEffect(() => {
		document.title = search ? "Поиск" : "Последние файлы"
	}, [search])

	return (
		<>
			<InputGroup startElement={<LuSearch />} endElement={<CloseButton hidden={search.length === 0} disabled={isPending} onClick={() => setSearch("")} size="xs" me={"-2"} />}>
				<Input
					value={search}
					onBlur={(e) => setSearch(e.currentTarget.value)}
					onKeyDown={(e: any) => {
						if (e.keyCode == 13) {
							e.preventDefault()
							e.target.blur()
						}
					}}
					disabled={isPending}
					placeholder={"Поиск"}
				/>
			</InputGroup>

			{!data && <PendingStatus isPending={isPending} error={error} />}

			{!!data && (
				<>
					{!search.length && <Heading>Последние файлы</Heading>}
					<Stack gap={0}>
						<For each={data}>{(item, index) => <PasteItem key={index} index={index + 1} data={item} />}</For>
					</Stack>{" "}
				</>
			)}
		</>
	)
}
