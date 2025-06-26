import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<Navbar className="bg-body-secondary border border-secondary border-2">
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
	);
}
