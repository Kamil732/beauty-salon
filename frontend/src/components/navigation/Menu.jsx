import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { logout } from '../../redux/actions/auth'

class Menu extends Component {
	static propTypes = {
		isAuthenticted: PropTypes.bool,
		loading: PropTypes.bool,
		logout: PropTypes.func.isRequired,
		closeNavigation: PropTypes.func.isRequired,
	}

	render() {
		const { loading, isAuthenticted, logout, closeNavigation } = this.props

		return (
			<>
				<NavLink
					to="/contact"
					className="nav__link"
					onClick={closeNavigation}
				>
					Kontakt
				</NavLink>
				<NavLink
					to="/my-meetings"
					className="nav__link"
					onClick={closeNavigation}
				>
					Moje wizyty
				</NavLink>
				{!loading ? (
					!isAuthenticted ? (
						<>
							<NavLink
								to="/login"
								className="nav__link"
								onClick={closeNavigation}
							>
								Zaloguj się
							</NavLink>
						</>
					) : (
						<button
							className="btn"
							onClick={() => {
								closeNavigation()
								logout()
							}}
						>
							Wyloguj się
						</button>
					)
				) : null}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticted: state.auth.isAuthenticted,
	loading: state.auth.loading,
})

const mapDispatchToProps = {
	logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
