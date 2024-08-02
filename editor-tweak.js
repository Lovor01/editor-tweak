/**
 * Change editor defaults
 */

// all is wrapped in async function, because await is used to get suspendSelect value
// if plain select were used, we would again have to have some kind of loop to wait for its results
// because it returns undefined untill value is fetched from REST

/**
 * set block editor preferences according to username
 *
 * @param {Object|Object[]} preferenceKeys your preference keys, string for single or array for multiple
 * @param {String} preferenceKeys.namespace - preference namespace
 * @param {String} preferenceKeys.key - preference key
 * @param {String} preferenceKeys.value - preference value to set
 * @param {String} username - user's username
 */
const setUsernamePreferences = async ( preferenceKeys, username ) => {
	// use new suspendSelect with awkward syntax - it seems I am the first using it,
	// so I had to figure it out how to use it
	async function getSuspended(callback) {
		let value;
		try {
			value = callback();
		} catch (error) {
			await error;
			value = callback();
		}
		return value
	}

	const suspendedSelector = wp.data.suspendSelect('core');
	// userShort because currentUser does not return all properties of user
	const userID = (await getSuspended(suspendedSelector.getCurrentUser)).id;
	const user = await getSuspended(() => suspendedSelector.getUser(userID));
	// test if username matches, if not bail out
	if (username !== undefined && user.username !== username) {
		return;
	}

	const setter = (namespaceKeyValue) => {wp.data.dispatch('core/preferences').set(
		namespaceKeyValue.namespace,
		namespaceKeyValue.key,
		namespaceKeyValue.value
	)};

	// set block list to open in left sidebar, block breadcrumbs, right-click menus in list view and most used blocks in menu to show for admin. For others, not.
	// you can find other keys by installing Redux browser extension, changing preference in UI and looking at DIFF tab in core/preferences to see what has changed
	// remember to select on left side the last store getter
	if (Array.isArray(preferenceKeys)) {
		preferenceKeys.forEach((keyValue) => {
			setter(keyValue);
		});
	} else {
		setter(preferenceKeys);
	}
};

/**
 * This is where you put your own code,
 * call setUsernamePreferences to set preferences according to user
 */
// set icon labels to true, just for username admin
setUsernamePreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'admin');
// set preferences for all users
setUsernamePreferences([
	// Contain text cursor inside block
	{namespace: 'core', key: 'keepCaretInsideBlock', value: true},
	// Distraction free
	{namespace: 'core', key: 'focusMode', value: false},
	// Use theme styles
	{namespace: 'core/edit-post', key: 'themeStyles', value: true},
]);
