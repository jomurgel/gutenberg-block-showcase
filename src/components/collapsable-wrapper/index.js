/**
 * External dependencies.
 */
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies.
 */
import { BlockControls } from '@wordpress/block-editor';
import { Button, Icon, ToolbarButton } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { chevronDown, chevronUp, settings, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Styles.
 */
import './edit.scss';

/**
 * Collapsable wrapper component.
 *
 * @param {Object}   param0              Props.
 * @param {bool}     param0.canRemove    Can remove.
 * @param {Function} param0.onEdit       On edit.
 * @param {Function} param0.onPreview    On preview.
 * @param {Function} param0.onToggle     On toggle.
 * @param {bool}     param0.isEditing    Is editing.
 * @param {bool}     param0.isOpen       Is open.
 * @param {bool}     param0.isHidden     Is hidden.
 * @param {bool}     param0.isPreviewing Is previewing.
 * @param {children} param0.children     Children.
 * @param {mixed}    param0.icon         Icon.
 * @param {string}   param0.className    Class name.
 * @param {string}   param0.clientId     Client ID.
 * @param {string}   param0.title        Title.
 *
 * @return {JSXElement} Collapsable wrapper component.
 */
function CollapsableWrapper( {
	canRemove,
	children,
	className,
	clientId,
	icon,
	isOpen: isOpenProp = false,
	isHidden,
	isEditing,
	isPreviewing,
	onEdit,
	onToggle,
	onPreview,
	title,
} ) {
	/**
	 * Local state.
	 */
	const [ isOpen, setIsOpen ] = useState( isOpenProp );

	/**
	 * Dispatchers.
	 */
	const { removeBlock } = useDispatch( 'core/block-editor' );

	/**
	 * Callback fired on toggle.
	 */
	useEffect( () => {
		if ( onToggle ) {
			onToggle( isOpen );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isOpen ] );

	return (
		<div
			className={ classNames( className, 'collapsable-wrapper', {
				'is-open': isOpen,
				hidden: isHidden,
			} ) }
		>
			<Button
				className="collapsable-wrapper__button"
				onClick={ () => setIsOpen( ! isOpen ) }
			>
				<div className="collapsable-wrapper__container">
					{ icon ? (
						<Icon
							className="collapsable-wrapper__button--icon"
							icon={ icon }
						/>
					) : null }
					{ title }
					<Icon
						className="collapsable-wrapper__button--chevron"
						icon={ isOpen ? chevronUp : chevronDown }
					/>
					{ canRemove ? (
						<Button
							className="collapsable-wrapper__button--remove"
							icon={ trash }
							iconSize={ 18 }
							label={ __( 'Delete block', 'gutenberg-block-showcase' ) }
							onClick={ () => removeBlock( clientId ) }
						/>
					) : null }
				</div>
			</Button>
			{ isOpen ? (
				<>
					<div className="collapsable-wrapper__content">
						{ children }
					</div>
					<BlockControls>
						{ onEdit ? (
							<ToolbarButton
								icon={ settings }
								isPressed={ isEditing }
								label={
									isEditing
										? __( 'Show Controls', 'gutenberg-block-showcase' )
										: __( 'Hide Controls', 'gutenberg-block-showcase' )
								}
								onClick={ onEdit }
							/>
						) : null }
						{ onPreview ? (
							<ToolbarButton
								isPressed={ isPreviewing }
								label={ __( 'Preview', 'gutenberg-block-showcase' ) }
								onClick={ onPreview }
							>
								{ __( 'Preview', 'gutenberg-block-showcase' ) }
							</ToolbarButton>
						) : null }
					</BlockControls>
				</>
			) : null }
		</div>
	);
}

CollapsableWrapper.defaultProps = {
	canRemove: false,
	className: '',
	icon: '',
	isOpen: false,
	isHidden: false,
	isEditing: false,
	isPreviewing: false,
	onEdit: null,
	onToggle: null,
	onPreview: null,
	title: '',
};

CollapsableWrapper.propTypes = {
	canRemove: PropTypes.bool,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	clientId: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType( [ PropTypes.string, PropTypes.element ] ),
	isEditing: PropTypes.bool,
	isHidden: PropTypes.bool,
	isOpen: PropTypes.bool,
	isPreviewing: PropTypes.bool,
	onEdit: PropTypes.func,
	onPreview: PropTypes.func,
	onToggle: PropTypes.func,
	title: PropTypes.string,
};

export default CollapsableWrapper;
