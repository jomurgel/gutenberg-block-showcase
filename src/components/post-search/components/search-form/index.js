/**
 * External dependencies.
 */
import parse from 'html-react-parser';
import classNames from 'classnames';

/**
 * WordPress dependencies.
 */
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Notice, SearchControl, SelectControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Components.
 */
import SearchResults from '../search-results';

/**
 * Hooks.
 */
import useDebounce from '../../../../hooks/use-debounce';

/**
 * Proptypes.
 */
import {
  POST_SEARCH_FORM_DEFAULTS,
  POST_SEARCH_FORM_SHAPE,
} from '../../prop-types';

/**
 * Styles.
 */
import '../../edit.scss';

/**
 * Generates the search form.
 *
 * @param {Object}   props              Props.
 * @param {Function} props.onChange     OnChange callback.
 * @param {string}   props.help         Help text, optional.
 * @param {string}   props.label        Label, optional.
 * @param {int}      props.threshold    Min number of characters made before search.
 * @param {Array}    props.postTypes    Array of supported post type slugs.
 * @param {int}      props.maxPages     Max number of pages to display.
 * @param {string}   props.placeholder  Field placeholder.
 * @param {string}   props.className    Optional className.
 * @param {int}      props.postsPerPage Number of posts to return per page.
 * @return {JSXElement} Search form component.
 */
function SearchForm({
  className,
  help,
  label,
  maxPages,
  onChange,
  placeholder,
  postsPerPage,
  postTypes,
  threshold,
}) {
  /**
   * Abort controller.
   */
  const controller =
    typeof AbortController === 'undefined'
      ? undefined
      : new AbortController();

  /**
   * Local state.
   */
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [corePostTypes, setCorePostTypes] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  /**
   * Items shape: object.
   *
   * {
   *   id: 0,
   *   media: {
   *     alt: '',
   *     url: '',
   *   }.
   *   Status: '',
   *   subtype: 'post-type-slug',
   *   title: '',
   *   type: 'post'
   *   url: '',
   * }.
   */
  const [items, setItems] = useState([]);

  /**
   * Debounce search value.
   */
  const debouncedSearch = useDebounce(search, 750);

  /**
   * Make API request for items by search string.
   *
   * @param {int} page Current page number.
   */
  const fetchItems = async (page = 1) => {
    if (page === 1) {
      // Reset state before we start the fetch.
      setItems([]);
      // Reset total pages.
      setTotalPages(1);
    }

    // Dismiss error on next try.
    setError('');
    // Set current page number.
    setPageNumber(page);
    // Set the loading flag.
    setLoading(true);

    // NOTE: Could be a nested ternary, but frowned upon.
    let searchSubType = selectedType || '';

    if (!selectedType) {
      searchSubType = postTypes?.length ? postTypes.join(',') : 'any';
    }

    // Get search results from the API and store them.
    const path = addQueryArgs('/wp/v2/search', {
      recent: true,
      page,
      per_page: postsPerPage,
      search: debouncedSearch,
      subtype: searchSubType,
      type: 'post', // TODO: Extend to support terms?
    });

    try {
      const response = await apiFetch({
        path,
        parse: false,
        signal: controller?.signal,
      }).then((data) => {
        const totalPagesFromResponse = parseInt(
          data.headers.get('X-WP-TotalPages'),
          10
        );
        // Set totalPage count to received page count unless larger than maxPages prop.
        setTotalPages(
          totalPagesFromResponse > maxPages
            ? maxPages
            : totalPagesFromResponse
        );
        return data.json();
      });

      if (response?.length) {
        setItems((prevState) => [...prevState, ...response]);
        setLoading(false);
      }
    } catch (response) {
      setError(
        404 === response?.status
          ? parse(
            sprintf(
								/* translators: search query */ __(
              'There has been an error with your search query for <em>"%s"</em>',
              'gutenberg-block-showcase'
            ),
              debouncedSearch
            )
          )
          : __('An error has occurred', 'gutenberg-block-showcase')
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch public post types.
   */
  const fetchPostTypes = async () => {
    // Get search results from the API and store them.
    const path = addQueryArgs('/wp/v2/types', {
      public: true,
      viewable: true,
      supports: {
        show_in_rest: true, // eslint-disable-line camelcase
      },
    });

    try {
      const response = await apiFetch({
        path,
      });

      if (response) {
        // Get all post types and exclude the ones we can't filter and don't need.
        const newTypes = Object.entries(response).filter(
          ([key]) =>
            !key.includes('wp_') &&
            ![
              'guest-author',
              'attachment',
              'nav_menu_item',
            ].includes(key)
        );
        // Re-combine the array into key/value objects.
        const returnValues = newTypes.reduce(
          (acc, [key, entry]) => {
            acc.push({ label: entry.name, value: key });
            return acc;
          },
          []
        );
        setCorePostTypes(returnValues);
      }
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
  };

  /**
   * On load fetch public post types.
   */
  useEffect(() => {
    fetchPostTypes();
  }, []);

  /**
   * Create the list of filterable post types.
   */
  useEffect(() => {
    let filterTypes = [];

    if (!corePostTypes?.length) {
      return;
    }

    // const postTypeList = ! postTypes?.length && corePostTypes ?
    // setFilterList();
    if (postTypes?.length) {
      filterTypes = corePostTypes.filter((type) =>
        postTypes.includes(type.value)
      );
    } else {
      filterTypes = corePostTypes;
    }

    setFilterList(filterTypes);
  }, [corePostTypes, postTypes]);

  /**
   * Handles submitting the input value on debounce.
   */
  useEffect(() => {
    if (debouncedSearch?.length > threshold) {
      fetchItems();
    }

    // Prevent fetch if we haven't
    // met our search string threshold.
    if (debouncedSearch?.length < threshold) {
      setSelectedType('');
      setItems([]);
      setPageNumber(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, threshold, selectedType]);

  return (
    <div className={classNames('post-search-control', className)}>
      {error ? (
        <Notice
          className="search-control__notice"
          onDismiss={() => setError('')}
          status="error"
        >
          {error}
        </Notice>
      ) : null}
      <SearchControl
        __nextHasNoMarginBottom={items?.length}
        help={!items?.length ? help : ''}
        label={label}
        onChange={setSearch}
        onClose={
          search?.length >= threshold
            ? () => {
              setSearch('');
              setItems([]);
              controller?.abort();
            }
            : null
        }
        placeholder={placeholder}
        value={search}
      />
      {filterList?.length > 1 && search?.length && items?.length ? (
        <SelectControl
          className="post-search-control--filter"
          label={__('Filter by Content Types', 'gutenberg-block-showcase')}
          onChange={(next) => {
            setSelectedType(next);
          }}
          options={[
            {
              label: __('Any', 'gutenberg-block-showcase'),
              value: '',
            },
            ...filterList,
          ]}
          value={selectedType}
        />
      ) : null}
      <SearchResults
        canLoadMore={totalPages > pageNumber && maxPages > pageNumber}
        isLoading={loading}
        isVisible={search?.length >= threshold}
        onChange={(next) => {
          setSearch('');
          onChange(next);
        }}
        onLoadMore={fetchItems}
        options={items}
        page={pageNumber}
        query={debouncedSearch}
      />
    </div>
  );
}

SearchForm.defaultProps = POST_SEARCH_FORM_DEFAULTS;

SearchForm.propTypes = POST_SEARCH_FORM_SHAPE;

export default SearchForm;
