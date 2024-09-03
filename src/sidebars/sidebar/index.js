/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { register } from '@wordpress/data';

/**
 * Custom slotfill.
 */
import GBSSidebarPanel from '../../components/gbs-sidebar-panel';

/**
 * Icon.
 */
import jmLogo from '../../assets/jm';

/**
 * Shared.
 */
const sidebarName = 'gbs-sidebar-panel';
const sidebarLabel = __('GBS Controls', 'gutenberg-block-showcase');

/**
 * Custom store.
 */
import { store } from '../../store';

/**
 * Enable the store globally.
 */
register(store);

/**
 * Sidebar panel consolidation.
 *
 * @return {JSXElement} Sidebar panel.
 */
function GBSSidebar() {
  return (
    <>
      <PluginSidebar
        icon={jmLogo}
        name={sidebarName}
        title={sidebarLabel}
      >
        <GBSSidebarPanel.Slot>
          {(fills) => (fills ? fills : null)}
        </GBSSidebarPanel.Slot>
      </PluginSidebar>
      <PluginSidebarMoreMenuItem icon={jmLogo} target={sidebarName}>
        {sidebarLabel}
      </PluginSidebarMoreMenuItem>
    </>
  );
}

registerPlugin(sidebarName, { render: GBSSidebar });
