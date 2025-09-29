import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RoutePath } from './common/enums/enumConstant.js';
import Layout from './components/Layout.jsx';
import Landing from './pages/landing/landing.jsx';
import Account from './pages/account/account.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Page404 from './pages/page404/index.jsx';
import CreateEditAccount from './pages/account/create-edit-account/CreateEditAccount.jsx';
import CreateEditServices from './pages/services/create-edit-services/CreateEditServices.jsx';
import CreateEditCards from './pages/cards/create-edit-cards/CreateEditCards.jsx';
import ViewCard from './pages/cards/view-card/ViewCard.jsx';
import { ChangePassword } from './pages/auth/change-password/ChangePassword.jsx';
import Pets from './pages/my-pets/pets.jsx';
import PetDetails from './pages/my-pets/pet-details/pet-details.jsx';
import AddUpdateCat from './pages/my-pets/add-update-cat/AddUpdateCat.jsx';
import AddUpdateDog from './pages/my-pets/add-update-dog/AddUpdateDog.jsx';
import ScrollToTop from './common/ScrollToTop/ScrollToTop.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path={RoutePath.HOME} element={<Landing />} />
            <Route path={RoutePath.ACCOUNT} element={<Account />} />
            <Route path={RoutePath.CREATE_ACCOUNT} element={<CreateEditAccount />} />
            <Route path={RoutePath.EDIT_ACCOUNT} element={<CreateEditAccount />} />
            <Route path={RoutePath.ADD_SERVICE} element={<CreateEditServices />} />
            <Route path={RoutePath.EDIT_SERVICE} element={<CreateEditServices />} />
            <Route path={RoutePath.ADD_CARD} element={<CreateEditCards />} />
            <Route path={RoutePath.EDIT_CARD} element={<CreateEditCards />} />
            <Route path={RoutePath.VIEW_CARD} element={<ViewCard />} />
            <Route path={RoutePath.CHANGE_PASSWORD} element={<ChangePassword />} />
            <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
            <Route path={RoutePath.PETS} element={<Pets />} />
            <Route path={RoutePath.PET_DETAILS} element={<PetDetails />} />
            <Route path={RoutePath.ADD_DOG} element={<AddUpdateDog />} />
            <Route path={RoutePath.ADD_CAT} element={<AddUpdateCat />} />
            <Route path={RoutePath.EDIT_DOG} element={<AddUpdateDog />} />
            <Route path={RoutePath.EDIT_CAT} element={<AddUpdateCat />} />
            <Route path={RoutePath.PAGE_404} element={<Page404 />} />
            <Route path="*" element={<Navigate to={RoutePath.PAGE_404} replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
