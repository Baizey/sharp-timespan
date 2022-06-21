# npm-time-span

Simple time span class

## Goals of this package

- Easy, readable, time handling code

## Quick start

```
type Time = { days?: number, hours?: number, minutes?: number, seconds?: number, millis?: number }
Note: string arguments below are of type `keyof Time`
type SpanProps =
    | TimeSpan
    | Date (converts to Date.getTime())
    | number (milliseconds)
    | Time

constructors:
new TimeSpan(SpanProps)
TimeSpan.of(SpanProps)
TimeSpan.since(SpanProps)
TimeSpan.until(SpanProps)
TimeSpan.between(SpanProps, SpanProps)

Note: TimeSpan is immutable, all functions return new instances

import { TimeSpan, oneDay, oneHour, oneWeek, oneSecond } from 'sharp-time-span'

TimeSpan.of(SpanProps) shorthand for new TimeSpan(SpanProps)

TimeSpan.between(Date|number, Date|number)
TimeSpan.between(new date(2020), new Date(2040)) // TimeSpan of 20 years
TimeSpan.between(new date(2040), new Date(2020)) // TimeSpan of -20 years

TimeSpan.until(Date|number) shorthand for TimeSpan.between(Date.now(), SpanProps)
TimeSpan.since(Date|number) shorthand for TimeSpan.between(SpanProps, Date.now())

Static constants:
TimeSpan.oneWeek
TimeSpan.oneDay
TimeSpan.oneHour
TimeSpan.oneMinute
TimeSpan.oneSecond
TimeSpan.zero

Utility functions:
oneDay.multiplyBy(Number(5)) // TimeSpan of 5 days
oneDay.as('hours') // Number(24)
oneDay.hours // Number(24)
oneSecond.millis // 1000
oneDay.isGreaterThan(oneHour) // true
oneDay.isLessThan(oneHour) // false
oneDay.isEqualTo(TimeSpan.of({ days: 1 })) // true
oneDay.plus( oneDay ) // TimeSpan of 2 days
oneDay.minus( oneHour ) // TimeSpan of 23 hours
TimeSpan.of({ days: 1 }).negate() // TimeSpan of -1 day
TimeSpan.of({ days: -1 }).negate() // TimeSpan of 1 day
TimeSpan.of({ days: 1 }).asAbsolute() // TimeSpan of 1 day
TimeSpan.of({ days: -1 }).asAbsolute() // TimeSpan of 1 day

TimeSpan.of({ days: 1, hours: 1 }).ceilFor('days') // TimeSpan of 2 days
TimeSpan.of({ days: 1, hours: 23 }).floorFor('days') // TimeSpan of 1 day
TimeSpan.of({ days: 1, hours: 12 }).roundFor('days') // TimeSpan of 2 days

TimeSpan.of({ days: 1, hours: -1 }).ceilFor('days') // TimeSpan of -2 days
TimeSpan.of({ days: 1, hours: -23 }).floorFor('days') // TimeSpan of 1 day
TimeSpan.of({ days: 1, hours: -12 }).roundFor('days') // TimeSpan of -2 days

Use-case example:

const lastUpdate = new Date(...)

if (TimeSpan.since(lastUpdate).isGreaterThan(oneDay)) {
    updateStuff()
}
```
