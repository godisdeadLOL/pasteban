import { Box, Button, CloseButton, Dialog, Flex, Group, Portal, Wrap } from "@chakra-ui/react"
import { LuCopy, LuDownload, LuShare, LuTimer } from "react-icons/lu"
import { useColorModeValue } from "@/components/ui/color-mode"
import { CodeBlock, dracula, tomorrow, tomorrowNightBright } from "react-code-blocks"
import { AdaptiveButton, AdaptiveLinkButton } from "@/components/AdaptiveButton"
import { useNavigate, useParams } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PasteHeader } from "@/components/PasteHeader"
import { PasswordInput } from "@/components/ui/password-input"
import { useEffect, useState } from "preact/hooks"
import { copyToClipboard, encodeBase64, formatTimeUntil } from "@/utils"
import { PastePublic } from "@/schemas"
import { PasteShowSkeleton } from "@/pages/PasteShow/PasteShowSkeleton"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"
import { PasteActions } from "@/pages/PasteShow/PasteActions"

const KeyDialog = ({ open, setOpen, onApply, onCancel }: any) => {
	const [value, setValue] = useState("")

	const onOpenChange = (e: any) => {
		setOpen(e.open)
		if (!e.open) onCancel()
	}

	const apply = () => {
		setOpen(false)
		onApply(value)
	}

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>

						<Dialog.Header><Dialog.Title>Введите пароль</Dialog.Title></Dialog.Header>

						<Dialog.Body>
							<PasswordInput value={value} onChange={(e) => setValue(e.currentTarget.value)} />
						</Dialog.Body>

						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Назад</Button>
							</Dialog.ActionTrigger>
							<Button onClick={apply}>Подтвердить</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export const PasteShow = () => {
	const queryClient = useQueryClient()
	useEffect(() => {
		queryClient.removeQueries({ queryKey: ["paste_show"] })
	}, [])

	const { url } = useParams()
	const navigate = useNavigate()
	const [dialogueOpen, setDialogueOpen] = useState(false)

	const [key, setKey] = useLocalStorage(`key_${url!}`)
	const accessKey = usePasteAccessKey(url!)

	const { data, refetch } = useQuery<PastePublic>({
		queryKey: ["paste_show"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/pastes/${url}`, {
				headers: {
					Authorization: `Bearer ${encodeBase64(accessKey ?? "")}`,
					"Authorization-Format": "base64"
				},
			}).then((res) => {
				if (res.ok) return res.json()
				else {
					if (res.status === 401) setDialogueOpen(true)
					return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
				}
			}),
		retry: (failureCount, error) => {
			if (error.message.indexOf("Unauthorized") !== -1) return false
			else if (failureCount == 3) return false
			else return true
		},
		enabled: false
	})
	useEffect(() => {
		refetch()
	}, [accessKey])


	useEffect(() => {
		if (!!data) document.title = data.title
	}, [data])

	const onDialogueApply = (value: string) => {
		setKey(value ?? undefined)
		if (key === value) setDialogueOpen(true)
	}

	const generateFileBlobUrl = (content: string) => {
		const blob = new Blob([content], { type: "text/plain" })
		return window.URL.createObjectURL(blob)
	}

	return (
		<>
			<KeyDialog open={dialogueOpen} setOpen={setDialogueOpen} onApply={onDialogueApply} onCancel={() => navigate("/")} key={key} setKey={setKey} />

			{!data && <PasteShowSkeleton />}

			{data && <>
				<Flex alignItems={"center"} gap={{ base: 2, sm: 4 }} mb={4}>
					<PasteHeader pasteData={data} />

					<Box mx="auto" />

					{/* Действия */}
					<Wrap justifyContent="right">
						<AdaptiveButton onClick={() => copyToClipboard(document.URL, "Ссылка скопирована")} label="Поделиться" icon={<LuShare />} />
						<AdaptiveButton onClick={() => copyToClipboard(data.content, "Текст скопирован")} icon={<LuCopy />} label="Копировать" />
						<AdaptiveLinkButton download={`${data.title}.txt`} href={generateFileBlobUrl(data.content)} icon={<LuDownload />} label="Скачать" />

						{accessKey && <PasteActions pasteData={data} />}
					</Wrap>
				</Flex>

				{data.expiration && <Group color={"GrayText"} mb={4} mt={-2}>
					<LuTimer />
					<Box textWrap="nowrap" fontSize={"sm"}>
						Удаление через {formatTimeUntil(data.expiration)}
					</Box>
				</Group>}

				<Box fontFamily={"monospace"}>
					<CodeBlock
						customStyle={{ borderWidth: "1px", borderColor: "border", borderStyle: "solid" }}
						theme={useColorModeValue(tomorrow, tomorrowNightBright)}
						text={data.content}
						showLineNumbers={true}
						language={data.language}
					/>
				</Box>
			</>}
		</>
	)
}
