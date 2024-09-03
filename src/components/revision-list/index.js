/**
 * External dependencies.
 */
import parse from 'html-react-parser';
import moment from 'moment';
import get from 'lodash/get';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { PostTypeSupportCheck } from '@wordpress/editor';
import { Spinner, Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { getSettings } from '@wordpress/date';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Hooks.
 */
import usePrevious from '../../hooks/use-previous';

/**
 * Sidebar - This will only show if the post type has revisions enabled.
 *
 * @return {JSXElement} Revision panel.
 */
function RevisionList() {
  /**
   * Get the default date/time settings.
   */
  const settings = getSettings() || {};

  /**
   * Dispatchers.
   */
  const { setPostRevisions } = useDispatch('gbs/store');

  /**
   * Local state.
   */
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Get post revisions from state.
   */
  const revisions = useSelect((select) =>
    select('gbs/store').getPostRevisions()
  );

  /**
   * Get function to return post type registration details.
   */
  const { getPostType } = useSelect((select) => select(coreDataStore));

  /**
   * Subscribe to saving states.
   *
   * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
   *
   * @param {number}  postId              ID of the post.
   * @param {boolean} isSaving            Is the post saving.
   * @param {boolean} isAutosaving        Is the post autosaving.
   * @param {string}  restNamespace       The post rest namespace.
   * @param {string}  restBase            The post rest base.
   * @param {boolean} isRevisionSupported Is the core revision supported.
   * @param {int}     revisionsCOunt      Number of post revisions.
   */
  const {
    postId,
    isSaving,
    isAutosaving,
    restNamespace,
    restBase,
    isRevisionSupported,
    revisionsCount,
  } = useSelect((select) => {
    const {
      getEditedPostAttribute,
      getCurrentPostId,
      isSavingPost,
      isAutosavingPost,
      getCurrentPostRevisionsCount,
    } = select('core/editor');

    /**
     * Get post object value by key.
     *
     * @see https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#geteditedpostattribute
     */
    const postTypeSlug = getEditedPostAttribute('type');

    /**
     * A wrapper for getEntityRecord to get post type registration details and leverages entity types.
     *
     * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/index.js#L19
     * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/entity-types/type.ts
     */
    const postData = getPostType(postTypeSlug);

    return {
      postId: getCurrentPostId(),
      isSaving: isSavingPost(),
      isAutosaving: isAutosavingPost(),
      restNamespace: get(postData, ['rest_namespace'], ''),
      restBase: get(postData, ['rest_base'], ''),
      isRevisionSupported: get(
        postData,
        ['supports', 'revisions'],
        ''
      ),
      revisionsCount: getCurrentPostRevisionsCount(), // Default 0.
    };
  });

  /**
   * Previous count.
   */
  const previousRevisionsCount = usePrevious(revisionsCount);

  /**
   * Assign individual redirection links to each revision.
   *
   * @param {number} id Revision ID.
   */
  const revisionURL = (id) =>
    addQueryArgs('/wp-admin/revision.php', {
      revision: id,
    });

  /**
   * Time ago.
   *
   * @param {string} revisionDate Date to parse.
   */
  const getTimeAgo = (revisionDate) => {
    const getTimeDiff = moment(
      moment()
        .tz(settings?.timezone?.string || 'UTC')
        .format('YYYY-MM-DDTHH:mm:ss')
    ).diff(moment(revisionDate, 'YYYY-MM-DDTHH:mm:ss'));

    const timeAgo = moment()
      .subtract(moment.duration(getTimeDiff))
      .fromNow();

    return timeAgo;
  };

  /**
   * Fetch all revisions of the post at once.
   */
  const fetchRevisions = async () => {
    try {
      return await apiFetch({
        path: `/${restNamespace}/${restBase}/${postId}/revisions?per_page=6`,
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * Get the post Author's data.
   *
   * @param {Array} authorIDs Array of Author's IDs.
   * @return {Object} Author's data.
   */
  const fetchAuthors = async (authorIDs) => {
    try {
      return await apiFetch({
        path: addQueryArgs('/wp/v2/users', {
          include: authorIDs.join(','),
          _fields: 'id,name',
        }),
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * Async function to control the api call and data flow.
   *
   * @param {boolean} refresh Whether or not to refresh data.
   */
  const fetchRevisionData = async (refresh = false) => {
    // Bail if we don't support revisions or have no revisions.
    if (
      !isRevisionSupported ||
      revisionsCount === 0 ||
      (!refresh && revisions?.length > 0)
    ) {
      return;
    }

    // Reset loading state.
    setIsLoading(true);

    // Fetch all revisions.
    const postRevisions = await fetchRevisions();

    // Get all unique author ID's.
    const allAuthors = postRevisions.length && [
      ...new Set(postRevisions.map((item) => item.author)),
    ];

    // Fetch all authors and return their actual needed data.
    const postAuthors = await fetchAuthors(allAuthors);

    const revisionData = postRevisions.map((revision) => ({
      ...revision,
      author:
        postAuthors.find((item) => item.id === revision?.author)
          ?.name || '',
    }));

    // Set author and revision state.
    setPostRevisions(revisionData);

    // Stop loading.
    setIsLoading(false);
  };

  /**
   * Refetch settings after save to update the logs.
   */
  useEffect(() => {
    setTimeout(() => {
      if (
        !isAutosaving &&
        isSaving &&
        !isLoading &&
        previousRevisionsCount !== revisionsCount
      ) {
        fetchRevisionData(true);
      }
    }, 7500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSaving,
    isAutosaving,
    isLoading,
    previousRevisionsCount,
    revisionsCount,
  ]);

  /**
   * Fetch the revisions/authors data on mount.
   */
  useEffect(() => {
    fetchRevisionData();
    // Required to trigger on this boolean for proper functioning.
    // Okay, exhaustive deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevisionSupported]);

  return (
    <PostTypeSupportCheck supportKeys="revisions">
      {!isLoading && revisions?.length ? (
        <>
          {revisions.slice(0, 5).map(({ id, author, date }) => {
            return (
              <p key={id} className="revision-list--author">
                {parse(
                  `${author}, ${getTimeAgo(date)}
												 <br />
												 <a href="${revisionURL(id)}">
													 ${moment(date).format('MMMM DD, YYYY @ h:mm:ss a')}
												 </a>`
                )}
              </p>
            );
          })}
          { /* Load more button */}
          {revisions.length > 5 && (
            <Button
              href={
                revisions.length &&
                revisionURL(
                  revisions[revisions?.length - 1].id
                )
              }
              style={{
                justifyContent: 'center',
                marginTop: 15,
                width: '100%',
              }}
              variant="secondary"
            >
              {__('View more', 'gutenberg-block-showcase')}
            </Button>
          )}
        </>
      ) : null}

      {isLoading ? <Spinner /> : null}

      {!isLoading && errorMessage ? (
        <p
          style={{
            margin: '0',
            fontSize: 'smaller',
            color: 'red',
          }}
        >
          {sprintf(
            // Translators: %1$s - Error message.
            __('Message : %1$s ', 'gutenberg-block-showcase'),
            errorMessage
          )}
        </p>
      ) : null}
    </PostTypeSupportCheck>
  );
}

export default RevisionList;
