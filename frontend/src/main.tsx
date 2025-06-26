import { render } from "preact"
import { App } from "./app.tsx"
import { Provider } from "@/components/ui/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

render(
	<QueryClientProvider client={queryClient}>
		<Provider>
			<App />
		</Provider>
	</QueryClientProvider>,
	document.getElementById("app")!
)
