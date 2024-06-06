import { Store } from "./ReduxToolkits/Store.js";
import { Provider, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Main from "./Main.js";
import UseContextProvider from "./context/ContextProvider.jsx";
function App() {
  return (
    <UseContextProvider>
      <Provider store={Store}>
        <CssBaseline />
        <Main />
      </Provider>
    </UseContextProvider>
  );
}

export default App;
