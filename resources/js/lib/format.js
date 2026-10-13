const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const number = new Intl.NumberFormat('en-PH');
const dateTime = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
const date = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });

export const formatPeso = (value) => peso.format(Number(value ?? 0));
export const formatNumber = (value) => number.format(Number(value ?? 0));
export const formatDateTime = (value) => (value ? dateTime.format(new Date(value)) : '');
export const formatDate = (value) => (value ? date.format(new Date(value)) : '');
