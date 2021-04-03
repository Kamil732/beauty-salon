import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PageHero from '../../layout/PageHero'
import Calendar from '../../components/meetings/Calendar'

class MyMeetings extends Component {
	static propTypes = {
		userData: PropTypes.object.isRequired,
	}

	render() {
		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Content>
						<Calendar />
					</PageHero.Content>
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
