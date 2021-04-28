import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CardContainer from '../../layout/cards/CardContainer'
import PageHero from '../../layout/PageHero'
import Calendar from '../../components/meetings/calendar/Calendar'
import WorkHours from '../../components/meetings/WorkHours'

class MyMeetings extends Component {
	static propTypes = {
		userData: PropTypes.object.isRequired,
	}

	render() {
		return (
			<PageHero>
				<PageHero.Body data-aos="zoom-out-up">
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
