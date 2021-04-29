import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditBox from '../../layout/forms/EditBox'

class Pricing extends Component {
	static propTypes = {
		hair_price: PropTypes.string.isRequired,
		beard_price: PropTypes.string.isRequired,
	}

	render() {
		const { hair_price, beard_price } = this.props

		return (
			<table className="table">
				<tbody>
					<tr>
						<th>Włosy</th>
						<td>
							<EditBox
								name={process.env.REACT_APP_HAIR_PRICE}
								value={hair_price}
							>
								{hair_price ? `${hair_price} zł` : 'Za darmo'}
							</EditBox>
						</td>
					</tr>
					<tr>
						<th>Broda</th>
						<td>
							<EditBox
								name={process.env.REACT_APP_BEARD_PRICE}
								value={beard_price}
							>
								{beard_price ? `${beard_price} zł` : 'Za darmo'}
							</EditBox>
						</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

const mapStateToProps = (state) => ({
	hair_price: state.data.data[process.env.REACT_APP_HAIR_PRICE] || '',
	beard_price: state.data.data[process.env.REACT_APP_BEARD_PRICE] || '',
})

export default connect(mapStateToProps, null)(Pricing)
