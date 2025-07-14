import { Box, Container, Flex, Link, Stack } from "@chakra-ui/react"
import { LuPlus, LuSearch } from "react-icons/lu"
import { ColorModeButton } from "@/components/ui/color-mode"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router"

import { PasteShow } from "@/pages/PasteShow"
import { PasteList } from "@/pages/PasteList"
import { PasteCreate } from "@/pages/PasteCreate"

import { Toaster } from "@/components/ui/toaster"
import { Auth } from "@/pages/Auth"

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
			<BrowserRouter basename={import.meta.env.BASE_URL}>
				<Flex direction={"column"} minH={"100dvh"}>
					<NavBar />

					<Container maxW="3xl" py={4} flexGrow={1}>
						<Routes>
							<Route path="" element={<PasteList />} />
							<Route path="/auth" element={<Auth />} />
							<Route path="/create" element={<PasteCreate />} />
							<Route path="/:url" element={<PasteShow />} />
						</Routes>
					</Container>
				</Flex>
			</BrowserRouter>
		</>
	)
}
