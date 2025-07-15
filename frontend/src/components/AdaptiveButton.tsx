import { Button, IconButton, Skeleton } from "@chakra-ui/react"
import { Link } from "react-router"

export const AdaptiveButton = ({ label, icon, variant = "outline", onClick = null, ...other }: any) => {
	return (
		<>
			<Button onClick={onClick} display={{ base: "none", md: "flex" }} size="xs" variant={variant} {...other}>
				{icon} {label}
			</Button>

			<IconButton onClick={onClick} display={{ md: "none" }} size="xs" variant={variant} {...other}>
				{icon}
			</IconButton>
		</>
	)
}

export const AdaptiveLinkButton = ({ label, icon, href = null, download = null, ...other }: any) => {
	return (
		<>
			<Button display={{ base: "none", md: "flex" }} size="xs" variant="outline" asChild {...other}>
				{!download && <Link to={href}>{icon} {label}</Link>}
				{download && <a href={href} download={download}>{icon} {label}</a>}
			</Button>

			<IconButton display={{ md: "none" }} size="xs" variant="outline" asChild {...other}>
				{!download && <Link to={href}>{icon}</Link>}
				{download && <a href={href} download={download}>{icon}</a>}
			</IconButton>
		</>
	)
}

export const ButtonSkeleton = () => {
	return <Skeleton h={{ base: 8, md: 7 }} w={{ base: 8, md: 28 }} />
}