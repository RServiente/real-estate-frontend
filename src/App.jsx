import './App.css'
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPrivateRoute from "../routes/UserPrivateRoute";
import PropertyListPage from "../components/landing/PropertyListPage.jsx";
import PropertyDetailsPage from "../components/landing/PropertyDetailsPage";
import Landing from "../components/landing/landing";
import Dashboard from "../components/user/userDashboard";
import AddProperty from "../components/user/AddProperty.jsx";
import PropertyList from "../components/user/PropertyList.jsx";
import NotFound from "../components/not found/not found";
import AdminDashboard from '../components/admin/adminDashboard.jsx';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
      <Route path = "/" element = {<Landing/>}></Route>
      <Route path="/properties" element={<PropertyListPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route element= {<UserPrivateRoute/>}>
        <Route path='/dashboard/:userID' element={<Dashboard/>}></Route>
        <Route path='/dashboard/properties' element={<PropertyList/>}></Route>
        <Route path='/dashboard/add-property' element={<AddProperty/>}></Route>
        <Route path='/dashboard/edit-property/:id' element={<AddProperty/>}></Route>
        <Route path='/admin/dashboard/:userID' element={<AdminDashboard/>}></Route>
      </Route>
      </Routes>
    </Router>

  )
}

export default App
