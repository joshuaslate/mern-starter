import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Import miscellaneous routes and other requirements
import App from './components/app';
import NotFoundPage from './components/pages/not-found-page';

// Import static pages
import HomePage from './components/pages/home-page';
import ContactPage from './components/pages/contact-page';

// Import authentication related pages
import Register from './components/auth/register';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import ForgotPassword from './components/auth/forgot_password';
import ResetPassword from './components/auth/reset_password';

// Import dashboard pages
import Dashboard from './components/dashboard';
import ViewProfile from './components/dashboard/profile/view-profile';
import Inbox from './components/dashboard/messaging/inbox';

// Import higher order components
import RequireAuth from './components/auth/require_auth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="register" component={Register} />
    <Route path="login" component={Login} />
    <Route path="logout" component={Logout} />
    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="reset-password/:resetToken" component={ResetPassword} />
    <Route path="contact-us" component={ContactPage} />

    <Route path="dashboard">
      <IndexRoute component={RequireAuth(Dashboard)} />
      <Route path="profile" component={RequireAuth(ViewProfile)} />
      <Route path="inbox" component={RequireAuth(Inbox)} />
    </Route>

    <Route path="*" component={NotFoundPage} />
  </Route>
);
