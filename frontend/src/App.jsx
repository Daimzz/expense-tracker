import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import TransactionPage from "./pages/TransactionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Header from "./components/ui/Header.jsx";

function App() {
   const authUser = true;
   return (
      <>
         {authUser && <Header />}
         <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/transaction/:id' element={<TransactionPage />} />
            <Route path='*' element={<NotFoundPage />} />
         </Routes>
      </>
   );
}
export default App;