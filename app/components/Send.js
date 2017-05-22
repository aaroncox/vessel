// @flow
import React, { Component } from 'react';
import { Button, Grid, Label, Message, Modal, Radio, Segment, Select, Table } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react';

const { shell } = require('electron');

const exchangeOptions = [
  {
    key: 'bittrex',
    text: 'Bittrex (@bittrex)',
    value: 'bittrex',
  },
  {
    key: 'blocktrades',
    text: 'BlockTrades (@blocktrades)',
    value: 'blocktrades',
  },
  {
    key: 'changelly',
    text: 'Changelly (@changelly)',
    value: 'changelly',
  },
  {
    key: 'openledger',
    text: 'OpenLedger (@openledger)',
    value: 'openledger'
  },
  {
    key: 'poloniex',
    text: 'Poloniex (@poloniex)',
    value: 'poloniex',
  },
  {
    key: 'shapeshiftio',
    text: 'Shapeshift (@shapeshiftio)',
    value: 'shapeshiftio',
  },
];

const exchangeLinks = {
  bittrex: 'https://bittrex.com',
  blocktrades: 'https://blocktrades.us',
  changelly: 'https://changelly.com',
  openledger: 'https://openledger.io',
  poloniex: 'https://poloniex.com',
  shapeshiftio: 'https://shapeshift.io'
};

const defaultState = {
  from: '',
  to: '',
  amount: '',
  symbol: 'STEEM',
  memo: '',
  destination: 'account',
  // destination: 'exchange',
  modalPreview: false,
};

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      from: props.keys.names[0]
    });
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_transfer_resolved) {
      nextProps.actions.transferCompleted();
      this.resetState();
    }
  }
  resetState() {
    const props = this.props;
    const resetState = Object.assign({}, defaultState, {
      from: props.keys.names[0]
    });
    this.setState(resetState);
  }
  handleDestinationChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      to: '',
      memo: '',
      destination: value
    });
  }
  handleSymbolChange = (e: SyntheticEvent, { value }: { value: any }) => {
    const detectMemo = this.detectMemo(this.state.to, value);
    const newState = {
      amount: 0.000,
      symbol: value,
      memo: detectMemo || '',
      memoDetected: (detectMemo)
    };
    this.setState(newState);
  }

  detectMemo = (to: string, symbol: string) => {
    const { preferences } = this.props;
    const preferenceKey = [to, symbol].join("_").toLowerCase();
    if (
      preferences.hasOwnProperty(preferenceKey)
      && preferences[preferenceKey].trim !== ''
    ) {
      return preferences[preferenceKey];
    }
    return false;
  }

  handleToChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace('@', '').trim();
    const newState = {
      to: cleaned,
      memo: this.detectMemo(cleaned, this.state.symbol) || '',
      memoDetected: (this.detectMemo(cleaned, this.state.symbol))
    }
    // Set state
    this.setState(newState);
  }

  handleMemoChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.trim();
    this.setState({ memo: cleaned });
  }

  handleAmountChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = parseFloat(value.trim());
    this.setState({ amount: cleaned });
  }

  setAmountMaximum = (e: SyntheticEvent) => {
    const accounts = this.props.account.accounts;
    const { from, symbol } = this.state;
    const field = (symbol === 'SBD') ? 'sbd_balance' : 'balance';
    const amount = accounts[from][field].split(' ')[0];
    this.setState({ amount });
  }

  handleExternalLink = (e: SyntheticEvent) => {
    shell.openExternal(exchangeLinks[this.state.to]);
  }

  handleFromChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({ from: value })
  }

  isFormValid = () => {
    return true;
  }

  handlePreview = (e: SyntheticEvent) => {
    if(this.isFormValid()) {
      this.setState({ modalPreview: true });
    }
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    // console.log('modalPreview', this.state);
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  handleConfirm = (e: SyntheticEvent) => {
    const { from, to, symbol, memo } = this.state;
    const amount = parseFloat(this.state.amount).toFixed(3);
    const amountFormat = [amount, symbol].join(' ');
    this.props.actions.useKey('transfer', { from, to, amount: amountFormat, memo }, this.props.keys.permissions[from]);
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  render() {
    const accounts = this.props.account.accounts;
    const keys = this.props.keys;
    const availableFrom = keys.names.map((name) => {
      const hasPermission = (keys.permissions[name].type === 'active' || keys.permissions[name].type === 'owner');
      return hasPermission ? {
        key: name,
        text: name,
        value: name
      } : {
        key: name,
        disabled: true,
        text: name + ' (unavailable - active/owner key not loaded)'
      };
    });
    const field = (this.state.symbol === 'SBD') ? 'sbd_balance' : 'balance';
    const availableAmount = accounts[this.state.from][field];
    const errorLabel = <Label color="red" pointing/>;
    let modal = false;
    let toField = (
      <Form.Field
        control={Input}
        name="to"
        label="Enter the account name"
        placeholder="Enter the account name to send to..."
        value={this.state.to}
        onChange={this.handleToChange}
        // validationErrors={{
          // accountName: 'Invalid account name'
        // }}
        errorLabel={errorLabel}
      />
    );
    if (this.state.destination === 'exchange') {
      let externalLink = false;
      if (this.state.to) {
        externalLink = (
          <p style={{ marginLeft: '1em' }}>
            <a
              onClick={this.handleExternalLink}
              value={this.state.to}
            >
              {' '}
              {exchangeLinks[this.state.to]}
            </a>
          </p>
        );
      }
      toField = (
        <div>
          <Form.Field
            control={Select}
            search
            value={this.state.to}
            label="Select an exchange:"
            options={exchangeOptions}
            onChange={this.handleToChange}
            placeholder="Receiving exchange..."
          />
          {externalLink}
        </div>
      );
    }
    if (this.state.modalPreview) {
      modal = (
        <Modal
          open
          header="Please confirm the details of this transaction"
          content={
            <Segment basic padded>
              <p>
                Ensure that all of the data below looks correct before continuing.
                If you mistakenly send to the wrong accout (or with the wrong memo)
                you may lose funds.
              </p>
              <Table
                definition
                collapsing
                style={{ minWidth: '300px', margin: '0 auto' }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="right">Field</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      From:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.from}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      To:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.to}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Amount:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.amount}
                      {' '}
                      {this.state.symbol}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Memo:
                    </Table.Cell>
                    <Table.Cell>
                      <code>{this.state.memo}</code>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: 'cancel',
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancel,
              disabled: this.props.processing.account_transfer_pending
            },
            {
              key: 'yes',
              icon: 'checkmark',
              content: 'Confirmed - this is correct',
              color: 'green',
              onClick: this.handleConfirm,
              disabled: this.props.processing.account_transfer_pending
            }
          ]}
        />
      );
    }
    return (
      <Form
        error={!!this.props.processing.account_transfer_error}
        loading={this.props.processing.account_transfer_pending}
      >
        {modal}
        <Grid divided centered>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="from">Send from...</label>
              </div>
            </Grid.Column>
            <Grid.Column width={12}>
              <Form.Field
                control={Select}
                value={this.state.from}
                name="from"
                label="Select a loaded account"
                options={availableFrom}
                placeholder="Sending Account..."
                onChange={this.handleFromChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="destination">Send to a...</label>
              </div>
              <Form.Field
                control={Radio}
                name="destination"
                label="another user"
                value="account"
                checked={this.state.destination === 'account'}
                onChange={this.handleDestinationChange}
              />
              <Form.Field
                control={Radio}
                name="destination"
                label="an exchange"
                value="exchange"
                checked={this.state.destination === 'exchange'}
                onChange={this.handleDestinationChange}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              {toField}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="symbol">Select Currency Type</label>
              </div>
              <Form.Field
                control={Radio}
                name="symbol"
                label="STEEM"
                value="STEEM"
                checked={this.state.symbol === 'STEEM'}
                onChange={this.handleSymbolChange}
              />
              <Form.Field
                control={Radio}
                name="symbol"
                label="SBD"
                value="SBD"
                checked={this.state.symbol === 'SBD'}
                onChange={this.handleSymbolChange}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <div className="field">
                <label htmlFor="amount">Total {this.state.symbol} to Send</label>
              </div>
              <Form.Field
                control={Input}
                name="amount"
                placeholder="Enter the amount to transfer..."
                value={this.state.amount}
                onChange={this.handleAmountChange}
                validationErrors={{
                  isNumeric: 'The amount must be a number'
                }}
                errorLabel={errorLabel}
              />
              <p>
                <a
                  onClick={this.setAmountMaximum}
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}
                >
                  {availableAmount}
                </a>
                {' '}
                available to send.
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Field
                control={Input}
                name="memo"
                label={this.state.memoDetected ? 'Memo automatically set via preferences.' : 'Optional memo to include'}
                placeholder="Enter a memo to include with the transaction"
                value={this.state.memo}
                onChange={this.handleMemoChange}
                disabled={this.state.memoDetected}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Message
                error
                header="Operation Error"
                content={this.props.processing.account_transfer_error}
              />
              <Form.Field
                control={Button}
                color="purple"
                content="Preview Transaction"
                onClick={this.handlePreview}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
