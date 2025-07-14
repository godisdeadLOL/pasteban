import { Button, IconButton, Skeleton } from "@chakra-ui/react"
import { Link } from "react-router"

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
				<Link to={href} download={download}>
					{icon} {label}
				</Link>
			</Button>

			<IconButton display={{ md: "none" }} variant="outline" asChild>
				<Link to={href} download={download}>
					{icon}
				</Link>
			</IconButton>
		</>
	)
}

export const ButtonSkeleton = () => {
	return <Skeleton h={{ base: 10, md: 7 }} w={{ base: 10, md: 28 }} />
}