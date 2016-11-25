import React, { PropTypes } from 'react';

const propTypes = {
  handleClose: PropTypes.func,
  heading: PropTypes.string,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
};

const Modal = (props) => {
  const { handleClose, heading, isOpen, children } = props;
  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`}>
      <div className="modal-container">
        <div className="modal-content">
          <i onClick={handleClose} className="material-icons close">close</i>
          <h3>{heading}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = propTypes;

export default Modal;
