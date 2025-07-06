import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      {" "}
      <Toaster />
      <Component {...pageProps} />
    </Provider>
  );
}
