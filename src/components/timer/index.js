/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Returns the minute and seconds in a count-up timer.
 *
 * @param {Object}  props           Props.
 * @param {string}  props.className Optional className.
 * @param {boolean} props.isActive  Whether or not to kickoff timer.
 * @param {Object}  props.style     Optional inline styles.
 * @param {string}  props.label     Optional aria label.
 * @return {Array} Returns a tuple of the current minute and second..
 */
function Timer({ className, isActive, style, label }) {
	const timer = useRef(null);
	const [second, setSecond] = useState('00');
	const [minute, setMinute] = useState('00');
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		if (isActive) {
			timer.current = setInterval(() => {
				// Get seconds from counter.
				const secondCounter = counter % 60;
				const minuteCounter = Math.floor(counter / 60);

				// Form minutes and seconds string (append leading zero).
				const computedSecond =
					String(secondCounter).length === 1
						? `0${secondCounter}`
						: secondCounter;
				const computedMinute =
					String(minuteCounter).length === 1
						? `0${minuteCounter}`
						: minuteCounter;

				// Set new values.
				setSecond(computedSecond);
				setMinute(computedMinute);

				// Update counter.
				setCounter((next) => next + 1);
			}, 1000);
		}

		return () => clearInterval(timer.current);
	}, [isActive, counter]);

	return (
		<span aria-label={label} className={className} style={style}>
			{`${minute}:${second}`}
		</span>
	);
}

Timer.defaultProps = {
	className: '',
	style: {},
	label: __('Timer', 'gutenberg-block-showcase'),
};

Timer.propTypes = {
	className: PropTypes.string,
	isActive: PropTypes.bool.isRequired,
	label: PropTypes.string,
	style: PropTypes.shape({}),
};

export default Timer;
