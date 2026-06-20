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

  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);

  return sign + pad(Math.floor(absOffset / 60)) + ":" + pad(absOffset % 60);
}
