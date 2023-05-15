import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "suneditor/dist/css/suneditor.min.css";
import "./index.css";
import Management from "./App";


//import reportWebVitals from './reportWebVitals';

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     {/* <Router>
//       <Management />
//     </Router> */}
//     <Management />
//   </React.StrictMode>
// );

ReactDOM.render(
  <HashRouter>
    <Management />
  </HashRouter>,
  document.getElementById('root')
);

