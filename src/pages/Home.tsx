import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<>
			<Box>
				<Button onClick={() => navigate("/about")}>About</Button>
				<Button onClick={() => navigate("/practice")}>Practice</Button>
			</Box>
		</>
	);
}
