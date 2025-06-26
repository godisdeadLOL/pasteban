import { Box, Container, Flex, Link, Stack } from "@chakra-ui/react"
import { LuPlus, LuSearch } from "react-icons/lu"
import { ColorModeButton } from "@/components/ui/color-mode"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router"

import { PasteShow } from "@/PasteShow"
import { PasteList } from "@/PasteList"
import { PasteCreate } from "@/PasteCreate"
import { Toaster } from "./components/ui/toaster"

const NavBar = () => {
	const navigate = useNavigate()

	return (
		<Box px={4} borderBottom={1} borderStyle={"solid"} borderColor={"border"}>
			<Flex h={16} alignItems={"center"} gap={{ base: 2, sm: 4 }}>
				<Link onClick={() => navigate("/")} fontFamily={"heading"}>
					PasteBan
				</Link>

				<Box mx={"auto"} />

				<AdaptiveButton onClick={() => navigate("/create")} icon={<LuPlus />} label="Создать"></AdaptiveButton>
				<AdaptiveButton onClick={() => navigate("/")} icon={<LuSearch />} label="Поиск"></AdaptiveButton>
				<ColorModeButton />
			</Flex>
		</Box>
	)
}

export const App = () => {
	return (
		<>
			<Toaster />
			<BrowserRouter basename={import.meta.env.VITE_BASE_NAME}>
				<Flex direction={"column"} minH={"100dvh"}>
					<NavBar />

					<Container py={4} flexGrow={1} asChild>
						<Stack gap={4}>
							<Routes>
								<Route path="" element={<PasteList />} />
								<Route path="/create" element={<PasteCreate />} />
								<Route path="/:url" element={<PasteShow />} />
							</Routes>
						</Stack>
					</Container>
				</Flex>
			</BrowserRouter>
		</>
	)
}
