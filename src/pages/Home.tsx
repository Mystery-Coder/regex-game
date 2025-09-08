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
						style={{ marginRight: 20 }}
					/>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						RegEx Battle
					</Typography>
					<Button
						color="inherit"
						onClick={() => navigate("/about")}
						sx={{ textTransform: "none" }}
					>
						About
					</Button>
				</Toolbar>
			</AppBar>
			<Box className="center-content">
				<Button
					color="success"
					variant="outlined"
					onClick={() => navigate("/about")}
					sx={{ textTransform: "none" }}
				>
					Regex Challenge
				</Button>
				<Button
					color="secondary"
					variant="contained"
					onClick={() => navigate("/about")}
					sx={{ textTransform: "none" }}
				>
					String Challenge
				</Button>
			</Box>
		</Box>
	);
}
