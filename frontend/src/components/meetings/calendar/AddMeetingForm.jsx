import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class AddMeetingForm extends Component {
	static propTypes = {
		prop: PropTypes,
	}

	render() {
		return <div>xd</div>
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingForm)
