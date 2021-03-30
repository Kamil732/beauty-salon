import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { login } from '../../redux/actions/auth'

import AuthImg from '../../assets/images/auth.svg'

import CSRFToken from '../../components/CSRFToken'
import Card from '../layout/Card'
import FormControl from '../layout/forms/FormControl'
import Button from '../layout/buttons/Button'
import { Link } from 'react-router-dom'
import PageHero from '../layout/PageHero'

class Login extends Component {
	static propTypes = {
		login: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = (e) => {
		e.preventDefault()

		this.props.login(this.state.email, this.state.password)
	}

	render() {
		const { email, password } = this.state

		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={AuthImg}>
						<p className="text-broken">
							Nie masz jeszcze konta?{' '}
							<Link to="/register" className="slide-floor">
								Zarejestruj się
							</Link>
						</p>
					</PageHero.Img>

					<PageHero.Content>
						<PageHero.Title>Zaloguj się</PageHero.Title>

						<Card>
							<Card.Body>
								<form onSubmit={this.onSubmit}>
									<CSRFToken />

									<FormControl>
										<FormControl.Label htmlFor="email">
											Email:
										</FormControl.Label>
										<FormControl.Input
											isRequired
											type="email"
											id="email"
											name="email"
											onChange={this.onChange}
											value={email}
										/>
									</FormControl>
									<FormControl>
										<FormControl.Label htmlFor="password">
											Hasło:
										</FormControl.Label>
										<FormControl.Input
											isRequired
											type="password"
											id="password"
											name="password"
											onChange={this.onChange}
											value={password}
											min="3"
										/>
									</FormControl>

									<Button primary>Zaloguj się</Button>
								</form>
							</Card.Body>
						</Card>
					</PageHero.Content>
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
	login,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
