import React from 'react';
import {Routes, Route,Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Indexnav from "./indexnav"
import Indexpage from "./indexpage"
import DonorNavbar from './donarnav';
import DonorDashboard from './donardash';
import NeedyNavbar from './needynav';
import NeedyDashboard from './needydash';
import NeedyProfile from './needyprofile';
import MedFinder from './medfinder';
import UserDetailsForm from './DonarDetails';
import MedicineDonationForm from './availmedicine';
import MedicineList from './listedmedicines';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Indexnav></Indexnav>}>
        <Route index element={<Indexpage></Indexpage>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
      </Route>
      <Route path="/donar" element={<DonorNavbar></DonorNavbar>}>
          <Route index element={<DonorDashboard></DonorDashboard>}></Route>
          <Route path="/donar/profile" element={<UserDetailsForm></UserDetailsForm>}></Route>
          <Route path='/donar/postmed' element={<MedicineDonationForm></MedicineDonationForm>}></Route>
          <Route path="/donar/managemed" element={<MedicineList></MedicineList>}></Route>
          <Route path="/donar/donateequip"></Route>
          <Route path="/donar/manageequip"></Route>
      </Route>
      <Route path="/needy" element={<NeedyNavbar></NeedyNavbar>}>
        <Route index element={<NeedyDashboard></NeedyDashboard>}></Route>
        <Route path="/needy/profile" element={<NeedyProfile></NeedyProfile>}></Route>
        <Route path="/needy/reqmedicine" element={<MedFinder></MedFinder>}></Route>
        <Route path="/needy/reqequip"></Route>
      </Route>    
      
    </Routes>
  );
}

export default App;
