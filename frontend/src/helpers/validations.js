export const timeValidation = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
export const timeValidationErrorMessage =
	'Nie poprawny format. Format musi być w HH:MM'

export const phoneNumberValidation =
	/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/
export const phoneNumberValidationErrorMessage =
	'Numer telefonu jest niepoprawyny'
