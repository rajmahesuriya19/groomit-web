import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RoutePath } from './common/enums/enumConstant.js';
import Layout from './components/Layout.jsx';
import Landing from './pages/landing/landing.jsx';
import Account from './pages/account/account.jsx';
import Groomers from './pages/groomers/groomers.jsx';
import Appointments from './pages/appointments/appointments.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Page404 from './pages/page404/index.jsx';
import CreateEditCards from './pages/cards/create-edit-cards/CreateEditCards.jsx';
import ViewCard from './pages/cards/view-card/ViewCard.jsx';
import Pets from './pages/my-pets/pets.jsx';
import PetDetails from './pages/my-pets/pet-details/pet-details.jsx';
import AddUpdateCat from './pages/my-pets/add-update-cat/AddUpdateCat.jsx';
import AddUpdateDog from './pages/my-pets/add-update-dog/AddUpdateDog.jsx';
import ScrollToTop from './common/ScrollToTop/ScrollToTop.jsx';
import AppointmentDetail from './pages/appointments/AppointmentDetail/AppointmentDetail.jsx';
import Inbox from './pages/inbox/Inbox.jsx';
import RecurringScheduleDetails from './pages/appointments/RecurringPlan/RecurringScheduleDetails.jsx';
import AddUpdateDog2 from './pages/my-pets/add-update-dog/AddUpdateDog2.jsx';
import AddUpdateCat2 from './pages/my-pets/add-update-cat/AddUpdateCat2.jsx';
import PetsList from './pages/my-pets/Pets2.jsx';
import Addresses from './pages/service-addresses/Addresses.jsx';
import CreateEditServices from './pages/service-addresses/create-edit-services/CreateEditServices.jsx';
import CreateEditServices2 from './pages/service-addresses/create-edit-services/CreateEditServices2.jsx';
import PaymentCards from './pages/cards/PaymentCards.jsx';
import CreatePaymentCard from './pages/cards/create-edit-cards/CreatePaymentCard.jsx';
import NotificationsPreferences from './pages/notifications-preferences/NotificationsPreferences.jsx';
import ChangePassword from './pages/auth/change-password/ChangePassword.jsx';
import BookAddresses from './pages/Booking-flow/service-addresses/BookAddresses.jsx';
import ServiceTypePets from './pages/Booking-flow/ServiceTypePets/ServiceTypePets.jsx';
import PetsDetails from './pages/Booking-flow/PetsDetails/PetsDetails.jsx';
import BookedPets from './pages/Booking-flow/Booked-Pets/BookedPets.jsx';
import ExistingPets from './pages/Booking-flow/Existing-Pets/ExistingPets.jsx';
import Slots from './pages/Booking-flow/Slots/Slots.jsx';
import Checkout from './pages/Booking-flow/Checkout/Checkout.jsx';
import LatestDashboard from './pages/dashboard/LatestDashboard.jsx';
import TransactionReceipt from './pages/appointments/TransactionReceipt.jsx';
import { CreateEditAccount2 } from './pages/account/create-edit-account/CreateEditAccount2.jsx';
import TwilioProvider from './contexts/TwilioProvider/TwilioProvider.jsx';
import DemoCall from './demo/DemoCall.jsx';

function App() {
  return (
    <div>
      <TwilioProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path={RoutePath.HOME} element={<Landing />} />
              <Route path={RoutePath.GROOMERS} element={<Groomers />} />
              <Route path={RoutePath.ACCOUNT} element={<Account />} />
              <Route path={RoutePath.RECCURING_SCHEDULE} element={<RecurringScheduleDetails />} />
              <Route path={RoutePath.APPOINTMENTS} element={<Appointments />} />
              <Route path={RoutePath.TRANSACTION_RECEIPT} element={<TransactionReceipt />} />
              <Route path={RoutePath.APPOINTMENT_DETAIL} element={<AppointmentDetail />} />
              <Route path={RoutePath.REBOOK_DETAIL} element={<AppointmentDetail />} />
              <Route path={RoutePath.CREATE_ACCOUNT} element={<CreateEditAccount2 />} />
              <Route path={RoutePath.EDIT_ACCOUNT} element={<CreateEditAccount2 />} />
              <Route path={RoutePath.ADD_SERVICE} element={<CreateEditServices2 />} />
              <Route path={RoutePath.EDIT_SERVICE} element={<CreateEditServices2 />} />
              <Route path={RoutePath.CARDS} element={<PaymentCards />} />
              <Route path={RoutePath.ADD_CARD} element={<CreatePaymentCard />} />
              <Route path={RoutePath.EDIT_CARD} element={<CreateEditCards />} />
              <Route path={RoutePath.VIEW_CARD} element={<ViewCard />} />
              <Route path={RoutePath.CHANGE_PASSWORD} element={<ChangePassword />} />
              {/* <Route path={RoutePath.DASHBOARD} element={<Dashboard />} /> */}
              <Route path={RoutePath.DASHBOARD} element={<LatestDashboard />} />
              <Route path={RoutePath.DASHBOARD_TEST} element={<DemoCall />} />
              <Route path={RoutePath.PETS} element={<PetsList />} />
              <Route path={RoutePath.INBOX} element={<Inbox />} />
              <Route path={RoutePath.NOTIFICATIONS_PREFERENCES} element={<NotificationsPreferences />} />
              <Route path={RoutePath.SERVICE_ADDRESSES} element={<Addresses />} />
              <Route path={RoutePath.PET_DETAILS} element={<PetDetails />} />
              <Route path={RoutePath.ADD_DOG} element={<AddUpdateDog2 />} />
              <Route path={RoutePath.ADD_CAT} element={<AddUpdateCat2 />} />
              <Route path={RoutePath.EDIT_DOG} element={<AddUpdateDog2 />} />
              <Route path={RoutePath.EDIT_CAT} element={<AddUpdateCat2 />} />

              {/* Booking Flow */}
              <Route path={RoutePath.BOOK_SERVICE_ADDRESSE} element={<BookAddresses />} />
              <Route path={RoutePath.BOOK_SERVICE_TYPE_PET} element={<ServiceTypePets />} />
              <Route path={RoutePath.BOOK_PET_DETAILS} element={<PetsDetails />} />
              <Route path={RoutePath.BOOK_PET_DETAILS_FROM} element={<PetsDetails />} />
              <Route path={RoutePath.BOOK_PETS} element={<BookedPets />} />
              <Route path={RoutePath.EXISTING_PETS} element={<ExistingPets />} />
              <Route path={RoutePath.SLOTS} element={<Slots />} />
              <Route path={RoutePath.SLOT_WITH_GROOMER} element={<Slots />} />
              <Route path={RoutePath.CHECKOUT} element={<Checkout />} />
              <Route path={RoutePath.PAGE_404} element={<Page404 />} />
              <Route path="*" element={<Navigate to={RoutePath.PAGE_404} replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TwilioProvider>
    </div>
  );
}

export default App;
