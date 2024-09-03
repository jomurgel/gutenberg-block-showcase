/**
 * Dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { createSlotFill } from '@wordpress/components';

/**
 * Generate slotfill.
 */
export const { Fill, Slot } = createSlotFill('GBSSidebarPanel');

/**
 * GBSSidebarPanel Slotfill.
 *
 * @param {Object} props          Props object.
 * @param {Node[]} props.children Children.
 */
function GBSSidebarPanel({ children }) {
  return <Fill>{children}</Fill>;
}

GBSSidebarPanel.Slot = Slot;

GBSSidebarPanel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default GBSSidebarPanel;
