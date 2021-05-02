import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PageHero from '../../layout/PageHero'
import Calendar from '../../components/meetings/calendar/Calendar'

class MyMeetings extends Component {
	static propTypes = {
		userData: PropTypes.object.isRequired,
	}

	render() {
		return (
			<PageHero>
				<PageHero.Body>
					<Calendar />
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({
	userData: state.auth.data,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MyMeetings)
