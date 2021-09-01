export default function rfc3339(d: Date, useTimezoneOffset = false): string {
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    (useTimezoneOffset ? timezoneOffset(d.getTimezoneOffset()) : "")
  );
}

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

function timezoneOffset(offset: number) {
  if (offset === 0) {
    return "Z";
  }

  // eslint-disable-next-line prefer-const
  let sign = offset > 0 ? "-" : "+";
  offset = Math.abs(offset);

  return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
}
