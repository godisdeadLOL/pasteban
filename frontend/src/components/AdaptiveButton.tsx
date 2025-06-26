import { Button, IconButton } from "@chakra-ui/react"

export const AdaptiveButton = ({ label, icon, onClick = null }: any) => {
	return (
		<>
			<Button onClick={onClick} display={{ base: "none", md: "flex" }} size="xs" variant="outline">
				{icon} {label}
			</Button>

			<IconButton onClick={onClick} display={{ md: "none" }} variant="outline">
				{icon}
			</IconButton>
		</>
	)
}

export const AdaptiveLinkButton = ({ label, icon, href = null, download = null }: any) => {
	return (
		<>
			<Button display={{ base: "none", md: "flex" }} size="xs" variant="outline" asChild>
				<a href={href} download={download}>
					{icon} {label}
				</a>
			</Button>

			<IconButton display={{ md: "none" }} variant="outline" asChild>
				<a href={href} download={download}>
					{icon}
				</a>
			</IconButton>
		</>
	)
}
