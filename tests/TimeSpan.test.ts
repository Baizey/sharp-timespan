import { TimeSpan } from '../src'

const { oneDay, oneMinute, oneHour, oneWeek, of } = TimeSpan

const oneOfAll = of({ days: 1, hours: 1, minutes: 1, seconds: 1, millis: 1 })
const halfOfAll = of({ days: 1, hours: 12, minutes: 30, seconds: 30, millis: 500 })
const allMinusOneOfAll = of({ days: 1, hours: 23, minutes: 59, seconds: 59, millis: 999 })

const property = new Proxy({}, { get: (_, prop) => prop.toString() }) as { [key in keyof TimeSpan]: key }

describe(property.isEqualTo, () => {
	test('less than, should be false', () => expect(oneHour.isEqualTo(oneDay)).toBeFalsy())
	test('equal to, should be true', () => expect(oneHour.isEqualTo(oneHour)).toBeTruthy())
	test('greater than, should be false', () => expect(oneHour.isEqualTo(oneMinute)).toBeFalsy())
})

describe(property.isGreaterThan, () => {
	test('less than, should be false', () => expect(oneHour.isGreaterThan(oneDay)).toBeFalsy())
	test('equal to, should be false', () => expect(oneHour.isGreaterThan(oneHour)).toBeFalsy())
	test('greater than, should be true', () => expect(oneHour.isGreaterThan(oneMinute)).toBeTruthy())
})

describe(property.isLessThan, () => {
	test('less than, should be true', () => expect(oneHour.isLessThan(oneDay)).toBeTruthy())
	test('equal to, should be false', () => expect(oneHour.isLessThan(oneHour)).toBeFalsy())
	test('greater than, should be false', () => expect(oneHour.isLessThan(oneMinute)).toBeFalsy())
})

describe(property.isNegative, () => {
	test('0 to be false', () => expect(of(0).isNegative).toBeFalsy())
	test('-1 to be true', () => expect(of(-1).isNegative).toBeTruthy())
})

describe(property.isPositive, () => {
	test('0 to be true', () => expect(of(0).isPositive).toBeTruthy())
	test('-1 to be false', () => expect(of(-1).isPositive).toBeFalsy())
})

describe(property.asAbsolute, () => {
	test('1 to stay 1', () => expect(of(1).asAbsolute().millis).toEqual(1))
	test('-1 to become 1', () => expect(of(-1).asAbsolute().millis).toEqual(1))
})

describe(property.negate, () => {
	test('1 to become -1', () => expect(of(1).negate().millis).toEqual(-1))
	test('-1 to become 1', () => expect(of(-1).negate().millis).toEqual(1))
})

describe(property.plus, () => {
	test('adding positives', () => expect(oneDay.plus(oneDay).millis).toBe(oneDay.millis * 2))
	test('adding negatives', () => expect(oneDay.plus(-oneDay.millis).millis).toBe(0))
})

describe(property.minus, () => {
	test('adding positives', () => expect(oneDay.minus(oneDay).millis).toBe(0))
	test('adding negatives', () => expect(oneDay.minus(-oneDay.millis).millis).toBe(oneDay.millis * 2))
})

describe(property.multiplyBy, () => {
	test('simple test', () => expect(oneDay.multiplyBy(5).millis).toBe(oneDay.millis * 5))
})

describe(property.divideBy, () => {
	test('simple test', () => expect(oneDay.divideBy(3).millis).toBe(Math.round(oneDay.millis / 3)))
	test('millis are rounded off', () => expect(of(1).divideBy(2).millis).toBe(0.5))
	test('millis are rounded off', () => expect(of(1).divideBy(3).millis).toBe(0.))
})

describe('total time', () => {
	test(property.days, () => expect(oneWeek.days).toBe(7))
	test(property.hours, () => expect(oneWeek.hours).toBe(7 * 24))
	test(property.minutes, () => expect(oneWeek.minutes).toBe(7 * 24 * 60))
	test(property.seconds, () => expect(oneWeek.seconds).toBe(7 * 24 * 60 * 60))
	test(property.millis, () => expect(oneWeek.millis).toBe(7 * 24 * 60 * 60 * 1000))
})

describe(property.floorFor, () => {
	test(property.days, () => expect(allMinusOneOfAll.floorFor('days')).toEqual(oneDay))
	test(property.hours, () => expect(allMinusOneOfAll.floorFor('hours')).toEqual(of({ days: 2, hours: -1 })))
	test(property.minutes,
		() => expect(allMinusOneOfAll.floorFor('minutes')).toEqual(of({ days: 2, minutes: -1 })))
	test(property.seconds,
		() => expect(allMinusOneOfAll.floorFor('seconds')).toEqual(of({ days: 2, seconds: -1 })))
})

describe(property.roundFor, () => {
	test(`oneOfAll ${property.days}`, () => expect(oneOfAll.roundFor('days').days)
		.toBe(of({ days: 1 }).days))
	test(`oneOfAll ${property.hours}`, () => expect(oneOfAll.roundFor('hours').hours)
		.toBe(of({ days: 1, hours: 1 }).hours))
	test(`oneOfAll ${property.minutes}`, () => expect(oneOfAll.roundFor('minutes').minutes)
		.toBe(of({ days: 1, hours: 1, minutes: 1 }).minutes))
	test(`oneOfAll ${property.seconds}`, () => expect(oneOfAll.roundFor('seconds').seconds)
		.toBe(of({ days: 1, hours: 1, minutes: 1, seconds: 1 }).seconds))

	test(`halfOfAll ${property.days}`, () => expect(halfOfAll.roundFor('days').days)
		.toBe(of({ days: 2 }).days))
	test(`halfOfAll ${property.hours}`, () => expect(halfOfAll.roundFor('hours').hours)
		.toBe(of({ days: 1, hours: 13 }).hours))
	test(`halfOfAll ${property.minutes}`, () => expect(halfOfAll.roundFor('minutes').minutes)
		.toBe(of({ days: 1, hours: 12, minutes: 31 }).minutes))
	test(`halfOfAll ${property.seconds}`, () => expect(halfOfAll.roundFor('seconds').seconds)
		.toBe(of({ days: 1, hours: 12, minutes: 30, seconds: 31 }).seconds))

	test(`allMinusOneOfAll ${property.days}`, () => expect(allMinusOneOfAll.roundFor('days').days)
		.toBe(of({ days: 2 }).days))
	test(`allMinusOneOfAll ${property.hours}`, () => expect(allMinusOneOfAll.roundFor('hours').hours)
		.toBe(of({ days: 2 }).hours))
	test(`allMinusOneOfAll ${property.minutes}`, () => expect(allMinusOneOfAll.roundFor('minutes').minutes)
		.toBe(of({ days: 2 }).minutes))
	test(`allMinusOneOfAll ${property.seconds}`, () => expect(allMinusOneOfAll.roundFor('seconds').seconds)
		.toBe(of({ days: 2 }).seconds))
})

describe(property.ceilFor, () => {
	test(property.days, () => expect(oneOfAll.ceilFor('days').days)
		.toEqual(of({ days: 2 }).days))
	test(property.hours, () => expect(oneOfAll.ceilFor('hours').hours)
		.toEqual(of({ days: 1, hours: 2 }).hours))
	test(property.minutes, () => expect(oneOfAll.ceilFor('minutes').minutes)
		.toEqual(of({ days: 1, hours: 1, minutes: 2 }).minutes))
	test(property.seconds, () => expect(oneOfAll.ceilFor('seconds').seconds)
		.toEqual(of({ days: 1, hours: 1, minutes: 1, seconds: 2 }).seconds))
})

describe('static', () => {
	const today = Date.now()
	const yesterday = today - oneDay.millis
	const tomorrow = today + oneDay.millis
	beforeAll(() => Date.now = () => today)

	test('until', () => {
		const sut = TimeSpan.until(tomorrow)
		expect(sut.days).toBe(1)
	})
	test('since', () => {
		const sut = TimeSpan.since(yesterday)
		expect(sut.days).toBe(1)
	})
	test('between', () => {
		const sut = TimeSpan.between(yesterday, tomorrow)
		expect(sut.days).toBe(2)
	})
})