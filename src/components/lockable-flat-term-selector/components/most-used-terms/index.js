/**
 * External dependencies.
 */
import get from 'lodash/get';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Services.
 */
import { unescapeTerms } from '../../../../../src/utils/unescape';

const MIN_MOST_USED_TERMS = 3;
const DEFAULT_QUERY = {
  per_page: 10,
  orderby: 'count',
  order: 'desc',
  hide_empty: true,
  _fields: 'id,name,count',
  context: 'view',
};

/**
 * MostUsedTerms component. Returns list of most used terms.
 *
 * @param {Object} props          Props object.
 * @param {func}   props.onSelect Callback on select.
 * @param {string} props.taxonomy Taxonomy name slug.
 */
function MostUsedTerms({ onSelect, taxonomy }) {
  const { _terms, showTerms } = useSelect((select) => {
    const mostUsedTerms = select(coreStore).getEntityRecords(
      'taxonomy',
      taxonomy.slug,
      DEFAULT_QUERY
    );
    return {
      _terms: mostUsedTerms,
      showTerms: mostUsedTerms?.length >= MIN_MOST_USED_TERMS,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showTerms) {
    return null;
  }

  const terms = unescapeTerms(_terms);
  const label = get(taxonomy, ['labels', 'most_used']);

  return (
    <div className="editor-post-taxonomies__flat-term-most-used">
      <h3 className="editor-post-taxonomies__flat-term-most-used-label">
        {label}
      </h3>
      { /*
			 * Disable reason: The `list` ARIA role is redundant but
			 * Safari+VoiceOver won't announce the list otherwise.
			 */ }
      <ul className="editor-post-taxonomies__flat-term-most-used-list">
        {terms.map((term) => (
          <li key={term.id}>
            <Button
              onClick={() => onSelect(term)}
              variant="link"
            >
              {term.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

MostUsedTerms.propTypes = {
  onSelect: PropTypes.func.isRequired,
  taxonomy: PropTypes.object.isRequired,
};

export default MostUsedTerms;
