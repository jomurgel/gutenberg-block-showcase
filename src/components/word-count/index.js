/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { sprintf, _x } from '@wordpress/i18n';
import { count as wordCount } from '@wordpress/wordcount';

/**
 * Returns the word and character count for a given string.
 *
 * @param {Object} props                    Props object.
 * @param {string} props.text               The text to count.
 * @param {bool}   props.excludeCharSpaces  Whether to exclude spaces from the character count.
 * @param {number} props.showRemainingAlert Max limit to show the remaining alert.
 *
 * @return {JSX.Element} The count of words and character in the text.
 */
function WordCount({ text, excludeCharSpaces, showRemainingAlert }) {
  if (!text) {
    return null;
  }

  /**
   * Helper function for different counts.
   *
   * @param {string} value The string to count.
   * @return {number} The count.
   */
  const getCharacterCount = (value) => {
    if (!value) {
      return 0;
    }

    return wordCount(
      value,
      excludeCharSpaces
        ? 'characters_excluding_spaces'
        : 'characters_including_spaces',
      {}
    );
  };

  return (
    <p className="word-count">
      <span>
        {sprintf(
          /* translators: word count. */
          _x(
            'Words: %s, ',
            'Number of words counted in given string',
            'gutenberg-block-showcase'
          ),
          wordCount(text, 'words', {})
        )}
      </span>
      {showRemainingAlert ? (
        <span
          style={
            getCharacterCount(text) >= showRemainingAlert
              ? { color: 'red' }
              : { color: 'green' }
          }
        >
          {sprintf(
            /* translators: remaining character count. */
            _x(
              'Characters Remaining: %s',
              'Number of words remaining in given string',
              'gutenberg-block-showcase'
            ),
            showRemainingAlert - getCharacterCount(text)
          )}
        </span>
      ) : (
        <span>
          {sprintf(
            /* translators: character count. */
            _x(
              'Characters: %s',
              'Number of characters counted in given string',
              'gutenberg-block-showcase'
            ),
            getCharacterCount(text)
          )}
        </span>
      )}
    </p>
  );
}

WordCount.defaultProps = {
  excludeCharSpaces: false,
};

WordCount.propTypes = {
  excludeCharSpaces: PropTypes.bool,
  showRemainingAlert: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default WordCount;
