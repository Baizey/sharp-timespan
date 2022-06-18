export type Time = { days?: number, hours?: number, minutes?: number, seconds?: number, millis?: number }
export type TimeUnit = keyof Time
export type TimeSpanProps =
	| TimeSpan
	| number
	| Time
type DateProps =
	| number
	| Date

export class TimeSpan {
	static readonly oneWeek = TimeSpan.of({ days: 7 })
	static readonly oneDay = TimeSpan.of({ days: 1 })
	static readonly oneHour = TimeSpan.of({ hours: 1 })
	static readonly halfHour = TimeSpan.of({ minutes: 30 })
	static readonly fiveMinutes = TimeSpan.of({ minutes: 5 })
	static readonly oneMinute = TimeSpan.of({ minutes: 1 })
	static readonly halfMinute = TimeSpan.of({ seconds: 30 })
	static readonly oneSecond = TimeSpan.of({ seconds: 1 })

	public static of(props: TimeSpanProps) { return new TimeSpan(props) }

	public static since(past: DateProps) { return TimeSpan.between(past, Date.now()) }

	public static until(future: DateProps) { return TimeSpan.between(Date.now(), future) }

	public static between(past: DateProps, future: DateProps) {
		return TimeSpan
			.of(typeof future === 'number' ? future : future.getTime())
			.minus(typeof past === 'number' ? past : past.getTime())
	}

	readonly millis: number

	get isNegative() { return this.millis < 0 }

	get isPositive() { return !this.isNegative }

	get days() { return this.as('days') }

	get hours() { return this.as('hours') }

	get minutes() { return this.as('minutes') }

	get seconds() { return this.as('seconds') }

	constructor(value: TimeSpanProps) {
		if (typeof value === 'number') {
			this.millis = Math.round(value)
		} else if (value instanceof TimeSpan) {
			this.millis = value.millis
		} else {
			const { days = 0, hours = 0, minutes = 0, seconds = 0, millis = 0 } = value
			this.millis = Math.round(millis
				+ 1000 * (seconds
					+ 60 * (minutes
						+ 60 * (hours
							+ 24 * (days
							)))))
		}
	}

	isEqualTo(other: TimeSpanProps): boolean { return this.millis === new TimeSpan(other).millis }

	isGreaterThan(other: TimeSpanProps): boolean { return this.millis > new TimeSpan(other).millis }

	isLessThan(other: TimeSpanProps): boolean { return this.millis < new TimeSpan(other).millis }

	multiplyBy(factor: number) { return new TimeSpan(this.millis * factor) }

	divideBy(factor: number) { return new TimeSpan(this.millis / factor) }

	plus(other: TimeSpanProps): TimeSpan { return new TimeSpan(this.millis + new TimeSpan(other).millis) }

	minus(other: TimeSpanProps): TimeSpan { return new TimeSpan(this.millis - new TimeSpan(other).millis) }

	floorFor(unit: TimeUnit) {
		const span = Math.floor(Math.abs(this.as(unit)))
		return TimeSpan.of({ [unit]: this.millis < 0 ? -span : span })
	}

	roundFor(unit: TimeUnit) {
		const span = Math.round(Math.abs(this.as(unit)))
		return TimeSpan.of({ [unit]: this.millis < 0 ? -span : span })
	}

	ceilFor(unit: TimeUnit) {
		const span = Math.ceil(Math.abs(this.as(unit)))
		return TimeSpan.of({ [unit]: this.millis < 0 ? -span : span })
	}

	asAbsolute() { return new TimeSpan(Math.abs(this.millis)) }

	negate() { return new TimeSpan(-this.millis) }

	private as(timeUnit: TimeUnit) {
		let time = this.millis
		// noinspection FallThroughInSwitchStatementJS
		switch (timeUnit) {
			case 'days':
				time /= 24
			case 'hours':
				time /= 60
			case 'minutes':
				time /= 60
			case 'seconds':
				time /= 1000
			case 'millis':
				return time
		}
	}
}