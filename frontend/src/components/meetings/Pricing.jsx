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
								name="hair_price"
								value={hair_price}
								type="number"
								step=".01"
							>
								{hair_price ? `${hair_price} zł` : 'Za darmo'}
							</EditBox>
						</td>
					</tr>
					<tr>
						<th>Broda</th>
						<td>
							<EditBox
								name="beard_price"
								value={beard_price}
								type="number"
								step=".01"
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
	hair_price: state.data.cms.data.hair_price || '',
	beard_price: state.data.cms.data.beard_price || '',
})

export default connect(mapStateToProps, null)(Pricing)
