/**
 * Copyright 2016 Dialog LLC <info@dlg.im>
 */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Text } from '@dlghq/react-l10n';
import Modal from '../Modal/Modal';
import ModalClose from '../ModalClose/ModalClose';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalBody from '../ModalBody/ModalBody';
import ModalFooter from '../ModalFooter/ModalFooter';
import Spinner from '../Spinner/Spinner';
import Input from '../Input/Input';
import Icon from '../Icon/Icon';
import PeerAvatar from '../PeerAvatar/PeerAvatar';
import Button from '../Button/Button';
import styles from './AddContactModal.css';

class AddContactModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    contact: PropTypes.shape({
      peer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['user', 'group']).isRequired
      }).isRequired,
      name: PropTypes.string.isRequired,
      nick: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }),
    error: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired
  };

  static defaultProps = {
    isOpen: false,
    pending: false,
    contact: null
  };

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddContactClick = this.handleAddContactClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value ||
           nextProps.className !== this.props.className ||
           nextProps.isOpen !== this.props.isOpen ||
           nextProps.onClose !== this.props.onClose ||
           nextProps.onAdd !== this.props.onAdd ||
           nextProps.onComplete !== this.props.onComplete ||
           nextProps.pending !== this.props.pending ||
           nextProps.contact !== this.props.contact ||
           nextProps.error !== this.props.error;
  }

  handleInputChange(value) {
    this.setState({ value });
  }

  handleAddContactClick(event) {
    const { onAdd } = this.props;
    const { value } = this.state;

    onAdd(value, event);
  }

  renderHeader() {
    const { onClose } = this.props;

    return (
      <ModalHeader withBorder>
        <Text id="AddContactModal.title" />
        <ModalClose onClick={onClose} />
      </ModalHeader>
    );
  }

  renderBody() {
    const { pending, contact } = this.props;
    const { value } = this.state;

    if (pending) {
      return (
        <ModalBody className={styles.body}>
          <Spinner type="round" size="large" />
        </ModalBody>
      );
    }

    if (contact) {
      return (
        <ModalBody className={styles.body}>
          <div className={styles.avatar}>
            <PeerAvatar peer={contact} size="big" />
            <Icon glyph="done" className={styles.icon} />
          </div>
          <Text
            id="AddContactModal.user_added"
            values={{ username: contact.name }}
            tagName="p"
            className={styles.text}
            html
          />
        </ModalBody>
      );
    }

    return (
      <ModalBody className={styles.body}>
        <Input
          type="text"
          value={value}
          placeholder="AddContactModal.placeholder"
          className={styles.input}
          onChange={this.handleInputChange}
        />
        <Text id="AddContactModal.hint" tagName="p" className={styles.hint} />
      </ModalBody>
    );
  }

  renderFooter() {
    const { pending, contact, onComplete } = this.props;

    if (pending) {
      return null;
    }

    if (contact) {
      return (
        <ModalFooter className={styles.footer}>
          <Button wide rounded={false} onClick={onComplete}>
            <Text id="AddContactModal.button_send" />
          </Button>
        </ModalFooter>
      );
    }

    return (
      <ModalFooter className={styles.footer}>
        <Button wide rounded={false} onClick={this.handleAddContactClick}>
          <Text id="AddContactModal.button_add" />
        </Button>
      </ModalFooter>
    );
  }

  render() {
    const { className, isOpen, onClose } = this.props;
    const addContactClassName = classNames(styles.root, className);

    return (
      <Modal isOpen={isOpen} onClose={onClose} className={addContactClassName}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Modal>
    );
  }
}

export default AddContactModal;