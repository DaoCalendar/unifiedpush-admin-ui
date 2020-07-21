import React, { Component } from 'react';

import { Button } from '@patternfly/react-core';
import { Variant, WebPushVariant } from '@aerogear/unifiedpush-admin-client';
import { MultiEvaluationResult } from 'json-data-validator/build/src/Rule';
import {
  validatorBuilder,
  RuleBuilder,
  Data,
  Validator,
} from 'json-data-validator';
import { UPSForm, UPSFormField } from '../ApplicationDetail/panels/UPSForm';

interface State {
  webpushVapidPublicKey: string;
  webpushVapidPrivateKey: string;
  webpushAlias: string;
  formValidation?: MultiEvaluationResult | null;
}

interface Props {
  open: boolean;
  variantName: string;
  onSave: (variant: Variant) => void;
  close: () => void;
}

const initialState: State = {
  webpushVapidPublicKey: '',
  webpushVapidPrivateKey: '',
  webpushAlias: '',
  formValidation: null,
};

export class WebpushVariantForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...initialState };
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (prevProps.open && !this.props.open) {
      this.setState(initialState);
    }
  }

  render(): React.ReactNode {
    const save = () => {
      const variant = {
        name: this.props.variantName,
        type: 'web_push',
        publicKey: this.state.webpushVapidPublicKey,
        privateKey: this.state.webpushVapidPrivateKey,
        alias: this.state.webpushAlias,
      } as WebPushVariant;
      this.props.onSave(variant);
    };

    if (!this.props.open) {
      return null;
    }

    const validator: Validator = validatorBuilder()
      .newRule()
      .withField('webpushVapidPublicKey')
      .validate(RuleBuilder.matches('^[A-Za-z0-9_-]*$'))
      .validate(
        RuleBuilder.required()
          .withErrorMessage('A Valid Public key is required')
          .build()
      )
      .withField('webpushVapidPrivateKey')
      .validate(RuleBuilder.matches('^[A-Za-z0-9_-]*$'))
      .validate(
        RuleBuilder.required()
          .withErrorMessage('A Valid private key is required')
          .build()
      )
      .withField('webpushAlias')
      .validate(
        RuleBuilder.required()
          .withErrorMessage('Please enter a mailto or URL address')
          .build()
      )
      .build();

    return (
      <UPSForm validator={validator}>
        <UPSFormField
          fieldId="webpushVapidPublicKey"
          label={'Push Network'}
          helperText={'Vapid Public Key'}
          onChange={value => this.setState({ webpushVapidPublicKey: value })}
        />

        <UPSFormField
          fieldId="webpushVapidPrivateKey"
          helperText={'Vapid Private Key'}
          onChange={value => this.setState({ webpushVapidPrivateKey: value })}
        />

        <UPSFormField
          fieldId="webpushAlias"
          helperText={'Alias'}
          onChange={value => this.setState({ webpushAlias: value })}
        />

        <div className="variantFormButtons">
          <Button
            onClick={save}
            className="dialogBtn"
            isDisabled={
              !this.props.variantName ||
              this.props.variantName.trim().length === 0 ||
              !validator.validate((this.state as unknown) as Data).valid
            }
          >
            Create
          </Button>
          <Button variant="secondary" onClick={() => this.props.close()}>
            Cancel
          </Button>
        </div>
      </UPSForm>
    );
  }
}