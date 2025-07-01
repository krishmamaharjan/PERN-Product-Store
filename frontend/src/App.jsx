import Navbar from "./components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import {Toaster} from "react-hot-toast";
function App() {

  return (
    <>
      <div data-theme="light" className='min-h-screen bg-base-200 transition-coloers duration-300'>

        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/product/:id" element={<ProductPage />}/>
        </Routes>
      </div>
      <Toaster />
    </>
  )
}

export default App
