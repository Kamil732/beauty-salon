import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { logout } from '../../redux/actions/auth'

class Menu extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		loading: PropTypes.bool,
		logout: PropTypes.func.isRequired,
		closeNavigation: PropTypes.func.isRequired,
	}

	render() {
		const { loading, isAuthenticated, logout, closeNavigation } = this.props

		return (
			<>
				<NavLink
					exact
					to="/"
					className="nav__link"
					onClick={closeNavigation}
				>
					Home
				</NavLink>
				<NavLink
					to="/contact"
					className="nav__link"
					onClick={closeNavigation}
				>
					Kontakt
				</NavLink>
				<NavLink
					to="/gallery"
					className="nav__link"
					onClick={closeNavigation}
				>
					Galeria
				</NavLink>
				{!loading ? (
					!isAuthenticated ? (
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
						<>
							<NavLink
								to="/my-meetings"
								className="nav__link"
								onClick={closeNavigation}
							>
								Moje wizyty
							</NavLink>
							<button
								className="btn"
								onClick={() => {
									closeNavigation()
									logout()
								}}
							>
								Wyloguj się
							</button>
						</>
					)
				) : null}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading,
})

const mapDispatchToProps = {
	logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
