import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Calendar from '../../components/meetings/calendar/Calendar'
import PageHero from '../../layout/PageHero'

class Panel extends Component {
	static propTypes = {
		prop: PropTypes,
	}

	render() {
		return (
			<PageHero>
				<PageHero.Body>
					<Calendar isAdminPanel />
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Panel)
