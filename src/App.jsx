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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path={RoutePath.HOME} element={<Landing />} />
            <Route path={RoutePath.ACCOUNT} element={<Account />} />
            <Route path={RoutePath.CREATE_ACCOUNT} element={<CreateEditAccount />} />
            <Route path={RoutePath.EDIT_ACCOUNT} element={<CreateEditAccount />} />
            <Route path={RoutePath.ADD_SERVICE} element={<CreateEditServices />} />
            <Route path={RoutePath.EDIT_SERVICE} element={<CreateEditServices />} />
            <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
            <Route path={RoutePath.PAGE_404} element={<Page404/>}/>
            <Route path="*" element={<Navigate to={RoutePath.PAGE_404} replace/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
