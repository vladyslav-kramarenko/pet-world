import React from 'react';
import './App.css';
// import { Amplify } from 'aws-amplify';
// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';  // Import the UI styles
import awsconfig from './aws-exports';
// import {Router} from "@aws-amplify/ui-react/dist/types/components/Authenticator/Router";
import PetList from "./pages/PetList";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'; //
import PetProfile from "./pages/PetProfile";
import CreatePet from "./pages/CreatePet";
import EditPet from "./pages/EditPet";


// Amplify.configure(awsconfig);

function App() {
  // return (
  //     <Authenticator>
  //       {({ signOut, user }) => (
  //           <main>
  //             <h1>Welcome, {user?.username}</h1>
  //             <button onClick={signOut}>Sign out</button>
  //           </main>
  //       )}
  //     </Authenticator>
  // );
    return (
        <Router>
            <Routes>
                {/* Route for the home page which lists all pets */}
                <Route path="/" element={<PetList />} />

                {/* Route for viewing a specific pet's profile */}
                <Route path="/pet/:pet_id" element={<PetProfile />} />

                {/* Route for creating a new pet */}
                <Route path="/create" element={<CreatePet />} />

                {/* Route for editing an existing pet */}
                <Route path="/edit/:pet_id" element={<EditPet />} />

                {/* Redirect to the home page if the route doesn't exist */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
