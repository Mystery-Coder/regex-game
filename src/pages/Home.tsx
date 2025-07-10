import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<>
			<Navbar
				className="border border-secondary border-2"
				style={{
					background: "",
				}}
			>
				<Container fluid>
					<Navbar.Brand className="fs-3">
						<img
							alt=""
							src="/regex.png"
							width="40"
							height="40d"
							className="d-inline-block align-top"
						/>{" "}
						Regex Game
					</Navbar.Brand>
					<Nav>
						<Nav.Link
							className="fw-bolder fs-5"
							onClick={() => navigate("/about")}
						>
							About
						</Nav.Link>
						<Nav.Link
							className="fw-bolder fs-5"
							onClick={() => navigate("/practice")}
						>
							Practice
						</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
			<Container
				fluid
				className="d-flex flex-column justify-content-center align-items-center"
				style={{
					height: "calc(100vh - 56px)",
					background:
						"linear-gradient(to right,rgb(79, 254, 169),rgb(25, 47, 246),rgb(87, 36, 255))",
				}} // Adjust height based on navbar
			>
				<Button
					variant="info"
					className="m-4 fs-4"
					onClick={() => navigate("/guess_regex")}
				>
					Guess the Regex
				</Button>
				<Button
					className="m-4 fs-4"
					onClick={() => navigate("/guess_pattern")}
				>
					Guess the Pattern
				</Button>
			</Container>
		</>
	);
}
