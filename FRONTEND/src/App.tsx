import { useRoutes } from "react-router-dom";
import { routes } from "./routes/route";

export default function App() {
  const routing = useRoutes(routes);
  return routing;
}
