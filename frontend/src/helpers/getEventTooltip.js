import moment from 'moment'
import React from 'react'

export default function getEventTooltip(event, services, showTime = true) {
	const start = moment(event.start)
	const end = moment(event.end)
	const eventDays = end.diff(start, 'days')

	return (
		<div className="event-tooltip">
			{showTime && (
				<b>
					{eventDays > 0 ? (
						<>
							{start.format('DD.MM.YYYY')}
							{eventDays > 1 && ` - ${end.format('DD.MM.YYYY')}`}
						</>
					) : (
						`${start.format('H:mm')} - ${end.format('H:mm')}`
					)}
				</b>
			)}
			{!event.blocked && (
				<>
					<span>
						{event.customer_first_name} {event.customer_last_name}
					</span>
					<b>Usługi:</b>
					<ol>
						{event.services.map((_service, index) => (
							<li key={index}>
								{
									services.find(
										(service) => service.id === _service.id
									).name
								}
							</li>
						))}
					</ol>
				</>
			)}

			{event.description && (
				<>
					<b>{event.blocked ? 'Powód' : 'Opis'}:</b>
					<p>{event.description}</p>
				</>
			)}
		</div>
	)
}
