import { Stack, InputGroup, CloseButton, Input, For, Heading } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"
import { handleResponse } from "@/utils"
import { PasteOverview } from "@/schemas"
import { PasteEntry } from "./PasteEntry"
import { PasteListSkeleton } from "./PasteListSkeleton"
import { PasteListFallback } from "./PasteListFallback"

export const PasteList = () => {
	const [search, setSearch] = useState("")

	const queryClient = useQueryClient()
	useEffect(() => {
		queryClient.removeQueries({ queryKey: ["paste_list"] })
	}, [search])

	const { isPending, data } = useQuery<PasteOverview[]>({
		queryKey: ["paste_list"],
		queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/pastes?` + new URLSearchParams({ query: search }).toString()).then((res) => handleResponse(res)),
	})

	useEffect(() => {
		document.title = search ? "Поиск" : "Последние файлы"
	}, [search])

	return (
		<>
			<InputGroup
				startElement={<LuSearch />}
				endElement={<CloseButton disabled={isPending} hidden={search.length === 0} onClick={() => setSearch("")} size="xs" me={"-2"} />}
				mb={4}
			>
				<Input placeholder={"Поиск"} value={search}
					disabled={isPending}
					onBlur={(e) => setSearch(e.currentTarget.value)}
					onKeyDown={(e: any) => {
						if (e.keyCode === 13) {
							e.preventDefault()
							e.target.blur()
						}
					}}
				/>
			</InputGroup>


			{!search && <Heading mb={4}>Последние файлы</Heading>}
			<Stack gap={0}>
				{!data && <PasteListSkeleton />}
				{data && <For each={data} fallback={<PasteListFallback mt={8} />}>{(item, index) => <PasteEntry key={item.url} index={index + 1} data={item} />}</For>}
			</Stack>
		</>
	)
}
