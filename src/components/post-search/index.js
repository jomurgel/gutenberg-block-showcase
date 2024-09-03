/**
 * Components.
 */
import SearchModal from './components/search-modal';
import SearchForm from './components/search-form';

// TODO: This should be a simple export `{ default as PostSearchForm } from './components/search-form';`
// But this is throwing an invariant error that needs to be resolved.

/**
 * Post search modal.
 *
 * @param {Object} props Pass native props.
 * @return {JSXElement} Search modal component.
 */
export function PostSearchModal( props ) {
	return <SearchModal { ...props } />;
}

/**
 * Post search form. Same as modal, but used inline.
 *
 * @param {Object} props Pass native props.
 * @return {JSXElement} Search form component.
 */
export function PostSearchForm( props ) {
	return <SearchForm { ...props } />;
}
