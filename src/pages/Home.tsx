import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<Box style={{ flexGrow: 1 }}>
			<Box
				style={{
					background: "var(--color-panel-solid, white)",
					borderBottom: "1px solid var(--gray-a4)",
				}}
			>
				<Flex
					align="center"
					justify="between"
					style={{ padding: "12px 20px", gap: "12px" }}
				>
					<Flex align="center" style={{ gap: "12px" }}>
						<img
							src="/regex.png"
							width={25}
							height={25}
							style={{ display: "block" }}
						/>
						<Heading size="4">RegEx Battle</Heading>
					</Flex>
					<Button variant="ghost" onClick={() => navigate("/about")}>
						About
					</Button>
				</Flex>
			</Box>
			<Box className="center-content">
				<Button
					color="green"
					variant="outline"
					onClick={() => navigate("/setup_regex_game")}
					size="3"
				>
					Regex Challenge
				</Button>
				<Button
					color="indigo"
					variant="solid"
					onClick={() => navigate("/setup_string_game")}
					size="3"
				>
					String Challenge
				</Button>
			</Box>
		</Box>
	);
}
