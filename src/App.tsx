import React from 'react';
import './App.css';
import awsconfig from './aws-exports';
import PetList from "./pages/PetList/PetList";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'; //
import PetProfilePage from "./pages/PetProfile/PetProfilePage";
import CreatePet from "./pages/CreatePetPage";
import EditPet from "./pages/EditPetPage/EditPetPage";
import {Amplify} from "aws-amplify";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";


Amplify.configure(awsconfig);

function App() {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/pets" element={<PetList />} />

                    {/* Route for viewing a specific pet's profile */}
                    <Route path="/pets/:id" element={<PetProfilePage />} />

                    {/* Route for creating a new pet */}
                    <Route path="/create" element={<CreatePet />} />

                    {/* Route for editing an existing pet */}
                    <Route path="/pets/:id/edit" element={<EditPet />} />

                    {/* Redirect to the home page if the route doesn't exist */}
                    <Route path="*" element={<Navigate to="/" replace />} />


                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
