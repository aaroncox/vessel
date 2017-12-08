// @flow
import React, { Component } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react'

export default class OperationsPromptFieldPercent extends Component {

  modifyPercent = (e, { value, name }) => {
    const amount = parseFloat(value).toFixed(3)
    this.props.modifyOpsPrompt(null, {
      index: 0,
      name,
      value: amount * 100
    })
  }

  render() {
    const { field, meta, opData } = this.props
    const defaultValue = (opData[field]) ? (parseFloat(opData[field]) / 100).toFixed(2) : 100
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
          onChange={this.modifyPercent}
          label='%'
          labelPosition='left'
        />
      </Form.Field>
    )
  }

}
