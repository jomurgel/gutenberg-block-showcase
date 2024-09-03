/**
 * External dependencies.
 */
import sanitizeHtml from 'sanitize-html';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PostTypeSupportCheck } from '@wordpress/editor';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Utils.
 */
import stripHTMLTags from '../../utils/strip-html-tags';

/**
 * Styles.
 */
import './edit.scss';

/**
 * The edit function for postTitle.
 */
function Edit() {
  /**
   * Current post title and slug, or empty string.
   */
  const { slug, title } = useSelect((select) => ({
    slug: select('core/editor').getEditedPostAttribute('slug'),
    title: select('core/editor').getEditedPostAttribute('title'),
  }));

  /**
   * Dispatchers.
   */
  const { editPost } = useDispatch('core/editor');

  /**
   * Remove the core title.
   */
  useEffect(() => {
    const editorIframe = document.querySelector('.block-editor-iframe__container iframe');
    const defaultTitle = editorIframe?.contentDocument?.querySelector('.editor-visual-editor__post-title-wrapper');

    // Hide the core title visually only.
    if (defaultTitle) {
      defaultTitle.style.height = 0;
      defaultTitle.style.overflow = 'hidden';
    }

    // Return the title visibility.
    return () => {
      if (defaultTitle) {
        defaultTitle.style.height = 'auto';
        defaultTitle.style.overflow = 'visible';
      }
    }
  }, []);

  /**
   * Strip html from the slug on change.
   */
  useEffect(() => {
    editPost({
      slug: stripHTMLTags(slug),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div {...useBlockProps()}>
      <PostTypeSupportCheck supportKeys="title">
        <RichText
          allowedFormats={[
            'core/bold',
            'core/italic',
            'core/strikethrough',
            'core/underline',
            'wpcom/underline',
          ]}
          className="wp-block-post-title editor-post-title editor-post-title__input"
          onChange={(next) =>
            editPost({
              title: sanitizeHtml(next, {
                allowedTags: ['b', 'em', 'i', 's', 'span', 'strong', 'u'],
                allowedAttributes: {
                  span: ['data-*', 'style'],
                },
                allowedStyles: {
                  /**
                   *
                   */
                  span: {
                    'text-decoration': [/^underline$/],
                  },
                },
              }),
            })
          }
          placeholder={__('Write Headline', 'gutenberg-block-showcase')}
          tagName="h1"
          value={title}
        />
      </PostTypeSupportCheck>
    </div>
  );
}

export default Edit;
