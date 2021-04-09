import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { login } from '../../redux/actions/auth'

import AuthIllustration from '../../assets/images/auth-illustration.svg'

import CSRFToken from '../../components/CSRFToken'
import Card from '../../layout/cards/Card'
import FormControl from '../../layout/forms/FormControl'
import Button from '../../layout/buttons/Button'
import { Link, Redirect } from 'react-router-dom'
import PageHero from '../../layout/PageHero'

class Login extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		login: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			email: '',
			password: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = (e) => {
		e.preventDefault()

		this.setState({ loading: true })
		this.props.login('xd', this.state.email, this.state.password)
		this.setState({ loading: false })
	}

	render() {
		const { loading, email, password } = this.state

		if (this.props.isAuthenticated) return <Redirect to="/" />

		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={AuthIllustration}>
						<p className="text-broken">
							Nie masz jeszcze konta? Kliknij{' '}
							<Link to="/contact" className="slide-floor">
								tutaj
							</Link>{' '}
							by się skontaktować w sprawie z kontem
						</p>
					</PageHero.Img>

					<PageHero.Content>
						<PageHero.Title>Zaloguj się</PageHero.Title>

						<Card>
							<Card.Body>
								<form onSubmit={this.onSubmit}>
									<CSRFToken />

									<FormControl>
										<FormControl.Label
											htmlFor="email"
											inputValue={email}
										>
											Email:
										</FormControl.Label>
										<FormControl.Input
											required
											type="email"
											id="email"
											name="email"
											onChange={this.onChange}
											value={email}
										/>
									</FormControl>
									<FormControl>
										<FormControl.Label
											htmlFor="password"
											inputValue={password}
										>
											Hasło:
										</FormControl.Label>
										<FormControl.Input
											required
											type="password"
											id="password"
											name="password"
											onChange={this.onChange}
											value={password}
											min="3"
										/>
									</FormControl>

									<Button
										primary
										loading={loading}
										loadingText="Logowanie"
									>
										Zaloguj się
									</Button>
								</form>
							</Card.Body>
						</Card>
					</PageHero.Content>
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	login,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
