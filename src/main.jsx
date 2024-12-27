import { createRoot } from "react-dom/client"; //react dom - turn react elements to html
import App from "./App.jsx";
import "./index.css";
import { AppContextProvider } from "./contexts/AppContext";
import { Route } from "wouter";

// setup redux
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

//createRoot(document.getElementById("root")).render(<App />); // - render component
const root = createRoot(document.getElementById("root"));

// root render (entry point)
root.render(
  <Provider store={store}>
    <AppContextProvider>
      <Route path="/" component={App} />
      <Route path="/:boardName" component={App} />
    </AppContextProvider>
  </Provider>
); // <App/> - first render component
