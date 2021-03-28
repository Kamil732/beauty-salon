import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'

import { default as NavigationMenu } from '../components/navigation/Menu'

class Header extends Component {
	state = {
		isNavActive: false,
	}

	render() {
		const { isNavActive } = this.state

		return (
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
						onClick={() => this.setState({ isNavActive: false })}
					></div>
				) : null}

				<nav className={`nav${isNavActive ? ' active' : ''}`}>
					<span
						className="nav__close"
						onClick={() => this.setState({ isNavActive: false })}
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
		)
	}
}

export default Header
