/**
 * External dependencies.
 */
import {
  debounce,
  escape as escapeString,
  find,
  isEmpty,
  uniqBy,
} from 'lodash';
import get from 'lodash/get';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { useEffect, useState } from '@wordpress/element';
import { Flex, FlexItem, Button, Spinner } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { applyFilters } from '@wordpress/hooks';

/**
 * Hooks.
 */
import usePrevious from '../../hooks/use-previous';

/**
 * Components.
 */
import BulkTermCreator from './components/bulk-term-creator';
import MostUsedTerms from './components/most-used-terms';
import TermSelector from './components/term-selector';

/**
 * Internal dependencies.
 */
import {
  unescapeString,
  unescapeTerm,
  unescapeTerms,
} from '../../utils/unescape';

/**
 * Module constants.
 */
const MAX_PAGES = 5;
const MAX_TERMS_SUGGESTIONS = 100;
const DEFAULT_QUERY = {
  per_page: MAX_TERMS_SUGGESTIONS,
  orderby: 'name',
  order: 'asc',
  _fields: 'id,name',
};

/**
 * Compare two term names to determine if they are the same.
 *
 * @param {string} termA Term name for comparison 1.
 * @param {string} termB Term name for comparison 2.
 * @return {boolean} Whether the term names are the same.
 */
const isSameTermName = (termA, termB) =>
  unescapeString(termA).toLowerCase() ===
  unescapeString(termB).toLowerCase();

/**
 * For each term name, return an id.
 *
 * @param {Array} names Array of names.
 * @param {Array} terms Array of terms.
 * @return {Array} Term id for each name in the names array.
 */
const termNamesToIds = (names, terms) => {
  return names.map(
    (termName) =>
      find(terms, (term) => isSameTermName(term.name, termName)).id
  );
};

/**
 * Replicate Core Term creation with locking control.
 *
 * @see https://github.com/WordPress/gutenberg/blob/75dfcf0c789645d2b7c67cc01bd15d5996fd79b5/packages/editor/src/components/post-taxonomies/flat-term-selector.js
 *
 * @param {Object}  param0          Props.
 * @param {string}  param0.slug     Term slug.
 * @param {boolean} param0.isLocked Whether or not to prevent term creation.
 * @return {JSXElement} Flat term selector.
 */
function LockableFlatTermSelector({ slug, isLocked }) {
  /**
   * Local state.
   */
  const [availableTerms, setAvailableTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [showTagCreator, setShowTagCreator] = useState(false);

  const controller =
    typeof AbortController === 'undefined'
      ? undefined
      : new AbortController();

  /**
   * Dispatchers.
   */
  const { editPost } = useDispatch('core/editor');

  /**
   * Watchers on taxonomy data.
   */
  const { hasCreateAction, hasAssignAction, terms, taxonomy, singularName } =
    useSelect((select) => {
      const { getCurrentPost } = select('core/editor');
      const { getTaxonomy } = select(coreStore);
      const _taxonomy = getTaxonomy(slug);
      return {
        hasAssignAction: _taxonomy
          ? get(
            getCurrentPost(),
            [
              '_links',
              'wp:action-assign-' + _taxonomy.rest_base,
            ],
            false
          )
          : false,
        hasCreateAction: _taxonomy
          ? get(
            getCurrentPost(),
            [
              '_links',
              'wp:action-create-' + _taxonomy.rest_base,
            ],
            false
          )
          : false,
        singularName: get(
          _taxonomy,
          ['labels', 'singular_name'],
          slug === 'post_tag' ? __('Tag') : __('Term')
        ),
        taxonomy: _taxonomy,
        terms: _taxonomy
          ? select('core/editor').getEditedPostAttribute(
            _taxonomy.rest_base
          )
          : [],
      };
    });

  /**
   * Get previous terms value.
   */
  const prevTerms = usePrevious(terms);

  /**
   * OnChange handler for updating the post..
   *
   * @param {Array}  nextTerms Array of terms to save.
   * @param {string} restBase  Rest base of taxonomy in which to save.
   */
  const onUpdateTerms = (nextTerms, restBase) =>
    editPost({ [restBase]: nextTerms });

  /**
   * Fetch terms.
   *
   * @param {Object} params Optional params object.
   * @return {Promise} Fetch request.
   */
  const fetchTerms = (params = {}) => {
    const query = { ...DEFAULT_QUERY, ...params };
    const request = apiFetch({
      path: addQueryArgs(`/wp/v2/${taxonomy.rest_base}`, query),
      signal: controller?.signal,
    });

    request.then(unescapeTerms).then((termsRequest) => {
      setAvailableTerms([
        ...availableTerms,
        ...termsRequest.filter(
          (term) =>
            !find(
              availableTerms,
              (availableTerm) => availableTerm.id === term.id
            )
        ),
      ]);
    });

    return request;
  };

  /**
   * Fetch search-specific terms.
   *
   * @param {Object} params Optional params object.
   * @param {int}    page   Page number.
   */
  const fetchSearchTerms = async (params = {}, page = 1) => {
    // Reset if the page number is one.
    if (1 === page) {
      setLoading(true);
      setPageNumber(1);
    }

    let totalPages = 0;
    const query = { ...DEFAULT_QUERY, ...params, page };
    const request = await apiFetch({
      path: addQueryArgs(`/wp/v2/${taxonomy.rest_base}`, query),
      parse: false,
      signal: controller?.signal,
    }).then((data) => {
      const totalPagesFromResponse = parseInt(
        data.headers.get('X-WP-TotalPages'),
        10
      );
      // Set totalPage count to received page count unless larger than maxPages prop.
      totalPages =
        totalPagesFromResponse > MAX_PAGES
          ? MAX_PAGES
          : totalPagesFromResponse;
      return data.json();
    });

    const nextAvailableTerms = [
      ...availableTerms,
      ...request.filter(
        (term) =>
          !find(
            availableTerms,
            (availableTerm) => availableTerm.id === term.id
          )
      ),
    ];

    setAvailableTerms(nextAvailableTerms);

    if (page < MAX_PAGES && page < parseInt(totalPages, 10)) {
      setPageNumber(page + 1);
    } else {
      setLoading(false);
    }
  };

  /**
   * Updated selected array of terms in state.
   *
   * @param {Array} nextTerms Array of terms.
   */
  const updateSelectedTerms = (nextTerms = []) => {
    const newSelectedTerms = nextTerms.reduce((accumulator, termId) => {
      const termObject = find(
        availableTerms,
        (term) => term.id === termId
      );
      if (termObject) {
        accumulator.push(termObject.name);
      }

      return accumulator;
    }, []);

    setSelectedTerms(newSelectedTerms);
  };

  /**
   * Find or create a term.
   * TODO: Should only find.
   *
   * @param {string} termName Term name.
   */
  const findOrCreateTerm = (termName) => {
    const termNameEscaped = escapeString(termName);

    // Tries to create a term or fetch it if it already exists.
    return apiFetch({
      path: `/wp/v2/${taxonomy.rest_base}`,
      method: isLocked ? 'GET' : 'POST',
      data: { name: termNameEscaped },
      signal: controller?.signal,
    })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'term_exists') {
          // If the terms exist, fetch it instead of creating a new one.
          return apiFetch({
            path: addQueryArgs(`/wp/v2/${taxonomy.rest_base}`, {
              ...DEFAULT_QUERY,
              search: termNameEscaped,
            }),
            signal: controller?.signal,
          })
            .then(unescapeTerms)
            .then((searchResult) => {
              return find(searchResult, (result) =>
                isSameTermName(result.name, termName)
              );
            });
        }

        // Assuming we have the permission to create terms, attempt.
        if (!isLocked) {
          return Promise.resolve({
            id: error.data.term_id,
            name: termName,
          });
        }
      })
      .then(unescapeTerm);
  };

  /**
   * OnChange handler for term setting/removing..
   *
   * @param {Array} termNames Array of term names.
   */
  const onChange = (termNames) => {
    const uniqueTerms = uniqBy(termNames, (term) => term.toLowerCase());
    setSelectedTerms(uniqueTerms);
    const newTermNames = uniqueTerms.filter(
      (termName) =>
        !find(availableTerms, (term) =>
          isSameTermName(term.name, termName)
        )
    );

    if (newTermNames.length === 0) {
      return onUpdateTerms(
        termNamesToIds(uniqueTerms, availableTerms),
        taxonomy.rest_base
      );
    }

    if (
      (isLocked && !hasAssignAction) ||
      (!isLocked && !hasCreateAction)
    ) {
      return;
    }

    Promise.all(newTermNames.map(findOrCreateTerm)).then(
      (newTerms) => {
        const newAvailableTerms = availableTerms.concat(newTerms);
        setAvailableTerms(newAvailableTerms);
        return onUpdateTerms(
          termNamesToIds(uniqueTerms, newAvailableTerms),
          taxonomy.rest_base
        );
      }
    );
  };

  /**
   * Fetches results by search term.
   *
   * @param {string} search Search string.
   */
  const searchTerms = (search = '') => {
    if (search.length >= 3) {
      setSearchQuery(search);
      fetchSearchTerms({ search });
    } else {
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 3 && pageNumber > 1) {
      fetchSearchTerms({ search: searchQuery }, pageNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchQuery]);

  /**
   * Append a new term to the FieldToken.
   *
   * @param {string} newTerm Term name.
   */
  const appendTerm = (newTerm) => {
    if (terms.includes(newTerm.id)) {
      return;
    }

    const newTerms = [...terms, newTerm.id];

    const termAddedMessage = sprintf(
      /* translators: %s: term name. */
      _x('%s added', 'term'),
      get(
        taxonomy,
        ['labels', 'singular_name'],
        slug === 'post_tag' ? __('Tag') : __('Term')
      )
    );

    speak(termAddedMessage, 'assertive');

    setAvailableTerms([...availableTerms, newTerm]);

    onUpdateTerms(newTerms, taxonomy.rest_base);
  };

  /**
   * Determine if loading should be displayed.
   */
  useEffect(() => {
    setLoading(!isEmpty(terms));
  }, [terms]);

  /**
   * On mount.
   */
  useEffect(() => {
    setLoading(!isEmpty(terms));
    if (!isEmpty(terms)) {
      fetchTerms({
        include: terms.join(','),
      }).then(
        () => {
          setLoading(false);
        },
        (xhr) => {
          if (!xhr || xhr.statusText === 'abort') {
            return;
          }
          setLoading(false);
        }
      );
    }

    return () => controller?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  /**
   * Update selected terms if we need to.
   */
  useEffect(() => {
    if (JSON.stringify(prevTerms) !== JSON.stringify(terms)) {
      updateSelectedTerms(terms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, prevTerms]);

  /**
   * Update selected terms when we have new availableTerms.
   */
  useEffect(() => {
    updateSelectedTerms(terms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTerms]);

  /**
   * Bail if we don't have permission to assign a term.
   */
  if (!hasAssignAction) {
    return null;
  }

  /**
   * Whether or not to enable locked-taxonomy multiple tags feature.
   *
   * @param {boolean} canBulkAddTags Whether or not we should display the bulk tag field.
   */
  const canBulkAddTags = applyFilters(
    'editor.lockableFlatTermSelector.canBulkAddTags',
    true
  );

  return (
    <>
      {showTagCreator ? (
        <BulkTermCreator
          onChange={onChange}
          selectedTerms={selectedTerms}
        />
      ) : null}
      <Flex align="flex-start">
        <FlexItem style={{ flex: '1 1 auto' }}>
          <>
            {loading ? (
              <Spinner className="term-selector-loader" />
            ) : null}
            <TermSelector
              canCreate={!isLocked && hasCreateAction}
              max={MAX_TERMS_SUGGESTIONS}
              onChange={onChange}
              onInputChange={debounce(searchTerms, 500)}
              singularName={singularName}
              slug={slug}
              suggestions={availableTerms.map(
                (term) => term.name
              )}
              taxonomy={taxonomy}
              value={selectedTerms}
            />
            {isLocked ? (
              <p className="components-form-token-field__help">
                {__(
                  'Search for existing terms using the input above. You are unable to add new terms here.',
                  'gutenberg-block-showcase'
                )}
              </p>
            ) : null}
          </>
        </FlexItem>
        {!isLocked && canBulkAddTags ? (
          <FlexItem style={{ minWidth: 'auto' }}>
            <Button
              onClick={() =>
                setShowTagCreator(!showTagCreator)
              }
              style={{
                marginTop: 17,
                maxHeight: selectedTerms?.length ? 33 : 30,
              }}
              variant="secondary"
            >
              {!showTagCreator
                ? __('Bulk-create Terms', 'gutenberg-block-showcase')
                : __('Close Bulk-create')}
            </Button>
          </FlexItem>
        ) : null}
      </Flex>
      <MostUsedTerms onSelect={appendTerm} taxonomy={taxonomy} />
    </>
  );
}

LockableFlatTermSelector.defaultProps = {
  isLocked: false,
};

LockableFlatTermSelector.propTypes = {
  isLocked: PropTypes.bool,
  slug: PropTypes.string.isRequired,
};

export default LockableFlatTermSelector;
