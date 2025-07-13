import { Box, Button, Toolbar, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<img
						src="/regex.png"
						width={25}
						height={25}
						style={{ marginRight: 4 }}
					/>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						RegEx Game
					</Typography>
					<Button color="inherit" onClick={() => navigate("/about")}>
						About
					</Button>
					<Button
						color="inherit"
						onClick={() => navigate("/practice")}
					>
						Practice
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
