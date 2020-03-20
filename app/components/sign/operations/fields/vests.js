// @flow
import React, { Component } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react'

export default class OperationsPromptFieldVests extends Component {

  state = {
    assetType: 'VESTS',
    assetAmount: 0,
  }

  updateVests = () => {
    const { field } = this.props
    const { assetAmount, assetType } = this.state
    let vests = [assetAmount, 'VESTS'].join(" ")
    if(assetType === 'HP') {
      const { total_vesting_fund_steem, total_vesting_shares } = this.props.hive.props
      const vesting_hive = parseFloat(total_vesting_fund_steem.split(" ")[0])
      const vesting_shares = parseFloat(total_vesting_shares.split(" ")[0])
      const converted = (assetAmount / vesting_hive * vesting_shares).toFixed(6)
      vests = [converted, 'VESTS'].join(" ")
    }
    this.props.modifyOpsPrompt(null, {
      index: 0,
      name: field,
      value: vests
    })
  }

  modifyAssetAmount = (e, { value, name }) => {
    let amount = parseFloat(value).toFixed(6)
    if(this.state.assetType === 'HP') {
      amount = parseFloat(value).toFixed(3)
    }
    this.setState({
      assetAmount: amount
    }, this.updateVests)
  }

  modifyAssetType = (e, { value, name }) => {
    this.setState({
      assetType: value
    }, this.updateVests)
  }

  render() {
    const { field, meta, opData } = this.props
    const defaultValue = (opData[field]) ? parseFloat(opData[field].split(" ")[0]) : 0
    return (
      <Form.Field>
        <label>
          {meta.label}
        </label>
        <Input
          fluid
          key={field}
          required
          index={0}
          name={field}
          defaultValue={defaultValue}
          onChange={this.modifyAssetAmount}
          label={<Dropdown name={field} onChange={this.modifyAssetType} defaultValue='VESTS' options={[{ key: 'VESTS', text: 'VESTS', value: 'VESTS' },{ key: 'HP', text: 'HP', value: 'HP' }]} />}
          labelPosition='left'
        />
      </Form.Field>
    )
  }

}
