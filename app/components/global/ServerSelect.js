// @flow
import React, { Component } from 'react';

import { Button, Header, Modal, Segment, Table } from 'semantic-ui-react';
import { Client } from 'dsteem';

const servers = [
  'wss://anyx.io',
  'wss://gtg.steem.house:8090',
  'wss://seed.bitcoiner.me',
  'wss://rpc.buildteam.io',
  'wss://steemd.pevo.science',
  'wss://steemd.minnowsupportproject.org',
  'wss://steemd.privex.io',
  'wss://steemd.steemgigs.org',
  'wss://wallet.steem.ws',
];

export default class ServerSelect extends Component {

  state = {
    loading: false,
    open: false,
    servers: {}
  }

  startStatus = () => {
    this.setState({open: true});
    this.interval = setInterval(this.checkStatus.bind(this), 15000);
    this.checkStatus();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  stopStatus = () => {
    clearInterval(this.interval);
    this.setState({ loading: false, open: false });
  }

  selectServer = (e, data) => {
    const server = data.value;
    const { refreshGlobalProps, setPreference } = this.props.actions;
    clearInterval(this.interval);
    this.setState({ loading: true, open: false });
    setPreference('steemd_node', server);
    refreshGlobalProps();
  }

  checkStatus = () => {
    servers.forEach((server) => {
      try {
        const client = new Client(server);
        client.database.getDynamicGlobalProperties().then((props) => {
          let servers = Object.assign({}, this.state.servers);
          servers[server.replace('wss', 'https')] = props.time;
          this.setState({servers});
        });
      } catch(e) {
        console.log(e)
      }
    })
  }

  render() {
    const { name } = this.props;
    const { servers } = this.state;
    const current = Object.keys(servers).map((server) => {
      return (
        <Table.Row>
          <Table.Cell>
            {server}
          </Table.Cell>
          <Table.Cell>
            {servers[server]}
          </Table.Cell>
          <Table.Cell collapsing>
            <Button primary onClick={this.selectServer} value={server}>
              Connect
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Modal
        closeIcon={true}
        color="blue"
        size="large"
        loading={this.state.loading}
        onOpen={this.startStatus}
        onClose={this.stopStatus}
        open={this.state.open}
        trigger={
          <Button floated="right" color="red" content="Change Servers"/>
        }
        >
          <Header attached="top">
            Select a Steem server to connect to:
          </Header>
          <Segment loading={this.state.loading}>
            <Table attached="bottom">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Server
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Last Block
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Controls
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {current}
              </Table.Body>
            </Table>
          </Segment>
      </Modal>
    );
  }
}
