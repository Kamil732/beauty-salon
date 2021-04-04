import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Panel extends Component {
	static propTypes = {
		prop: PropTypes,
	}

	render() {
		return <div>Panel</div>
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Panel)
