import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'

import { default as NavigationMenu } from '../components/navigation/Menu'

class Header extends Component {
	static propTypes = {
		message: PropTypes.string,
	}

	state = {
		isNavActive: false,
	}

	render() {
		const { message } = this.props
		const { isNavActive } = this.state

		return (
			<>
				<div className="header">
					<div className="mobile-nav">
						<Link to="/">
							<img
								src={logo}
								className="header__logo"
								alt="Damian Kwiecień"
							/>
						</Link>

						<div
							className="nav-btn"
							onClick={() => this.setState({ isNavActive: true })}
						>
							<span className="nav-btn__burger"></span>
							MENU
						</div>
					</div>

					{isNavActive ? (
						<div
							className="nav-background"
							onClick={() =>
								this.setState({ isNavActive: false })
							}
						></div>
					) : null}

					<nav className={`nav${isNavActive ? ' active' : ''}`}>
						<span
							className="btn-close d-md"
							onClick={() =>
								this.setState({ isNavActive: false })
							}
						></span>

						<NavigationMenu
							closeNavigation={() =>
								setTimeout(
									() => this.setState({ isNavActive: false }),
									300
								)
							}
						/>
					</nav>
				</div>

				{message ? <p className="message">{message}</p> : null}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	message: state.data.data.message,
})

export default connect(mapStateToProps, null)(Header)
