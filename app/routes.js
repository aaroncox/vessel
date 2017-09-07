/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import AccountsPage from './containers/AccountsPage';
import DebugPage from './containers/DebugPage';
import SettingsPage from './containers/SettingsPage';
import SendPage from './containers/SendPage';
import TransactionsPage from './containers/TransactionsPage';
import WelcomePage from './containers/WelcomePage';
import VestingPage from './containers/VestingPage';
import DecryptPrompt from './containers/DecryptPrompt';

export default () => (
  <App>
    <DecryptPrompt />
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/debug" component={DebugPage} />
      <Route path="/send/:to?/:amount?/:symbol?" component={SendPage} />
      <Route path="/vesting" component={VestingPage} />
      <Route path="/accounts" component={AccountsPage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>
  </App>
);
