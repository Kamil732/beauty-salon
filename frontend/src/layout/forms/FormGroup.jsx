import React from 'react'
import PropTypes from 'prop-types'

function FormGroup({ wrap, ...props }) {
	return <div className={`form-group${wrap ? ' wrap' : ''}`} {...props} />
}

FormGroup.prototype.propTypes = {
	wrap: PropTypes.bool,
}

export default FormGroup
