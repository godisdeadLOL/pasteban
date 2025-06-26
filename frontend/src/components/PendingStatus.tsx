import { Center, Group, Icon, Spinner, Text } from "@chakra-ui/react"
import { LuX } from "react-icons/lu"

export const PendingStatus = ({ isPending, error }: any) => (
	<Center flexGrow={1} py={4} pb={24}>
		{isPending && <Spinner size={"lg"} />}
		{error && (
			<Group>
				<Icon size="xl">
					<LuX />
				</Icon>
				<Text>{error.message}</Text>
			</Group>
		)}
	</Center>
)
