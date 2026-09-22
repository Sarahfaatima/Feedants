const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Formats an ISO timestamp as "10 Aug 26" to match the design reference.
// Dates are always stored as ISO in the backend; this is presentation only.
export function formatDateShort(isoString) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '--';
  const year = String(d.getFullYear()).slice(-2);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${year}`;
}

// Formats an ISO timestamp as "11:50 PM" to match the design reference.
export function formatTimeShort(isoString) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '--';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}
