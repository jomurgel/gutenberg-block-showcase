/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PostTypeSupportCheck } from '@wordpress/editor';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { backup } from '@wordpress/icons';
import { Panel, PanelBody } from '@wordpress/components';
import GBSSidebarPanel from '../../components/gbs-sidebar-panel';

/**
 * Components.
 */
import RevisionList from '../../components/revision-list';

/**
 * Styles.
 */
import './edit.scss';

/**
 * Sidebar - This will only show if the post type has revisions enabled.
 *
 * @return {JSXElement} Revision panel.
 */
function Revision() {
  /**
   * Subscribe to saving states.
   *
   * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
   */
  const revisionsCount = useSelect((select) =>
    select('core/editor').getCurrentPostRevisionsCount()
  );

  // Bail entirely if no revisions exists.
  if (!revisionsCount) {
    return null;
  }

  return (
    <>
    <PostTypeSupportCheck supportKeys="revisions">
        <PluginDocumentSettingPanel
          className="revision-list"
          icon={backup}
          name="revision"
          title={sprintf(
            /* translators: 1: Number of revisions */
            __('%d Revisions', 'gutenberg-block-showcase'),
            revisionsCount
          )}
        >
          <RevisionList />
        </PluginDocumentSettingPanel>
      </PostTypeSupportCheck>
      <GBSSidebarPanel>
        <Panel>
          <PanelBody title={__('Revisions', 'gutenberg-block-showcase')}>
            <RevisionList />
          </PanelBody>
        </Panel>
      </GBSSidebarPanel>
    </>
  );
}

registerPlugin('revision', { render: Revision });
