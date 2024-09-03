/**
 * Trigger lock post save.
 *
 * @param {string} lockId Lock it.
 * @return {Object} Dispatch object.
 */
export const lockPostSave = ( lockId ) => {
	return {
		type: 'SET_LOCK',
		lockId,
	};
};

/**
 * Trigger unlock.
 *
 * @param {string} lockId Lock it.
 * @return {Object} Dispatch object.
 */
export const unlockPostSave = ( lockId ) => {
	return {
		type: 'REMOVE_LOCK',
		lockId,
	};
};

/**
 * Set post revisions action.
 *
 * @param {Array} postRevisions Revisions array.
 * @return {Object} Dispatch object.
 */
export const setPostRevisions = ( postRevisions ) => {
	return {
		type: 'SET_REVISIONS',
		postRevisions,
	};
};
