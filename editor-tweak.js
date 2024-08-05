/**
 * Change editor defaults
 */
/* eslint-disable no-undef */

// all is wrapped in async function, because await is used to get suspendSelect value
// if plain select were used, we would again have to have some kind of loop to wait for its results
// because it returns undefined untill value is fetched from REST

/**
 * set block editor preferences according to username or role
 *
 * @param {Object|Object[]} preferenceKeys your preference keys, string for single or array for multiple
 * @param {String} preferenceKeys.namespace - preference namespace
 * @param {String} preferenceKeys.key - preference key
 * @param {String} preferenceKeys.value - preference value to set
 * @param {String} userIdentifier - user's username
 * @param {String} mode - mode of operation, can be 'role' or 'username'
 * @return {Promise} - void promise
 * @example
 * setUsernamePreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'admin', 'username');
 */
const conditionalSetPreferences = async ( preferenceKeys, userIdentifier, mode ) => {
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

	const throwParameterError = () => {
		throw new Error(
			`Function conditionalSetPreferences: userIndentifier (second parameter) was specified, but third parameter to describe second parameter
			which can be 'username' or 'role' is not specified correctly!`);
	};

	const suspendedSelector = wp.data.suspendSelect('core');
	// userShort because currentUser does not return all properties of user
	const userID = (await getSuspended(suspendedSelector.getCurrentUser)).id;
	const user = await getSuspended(() => suspendedSelector.getUser(userID));

	if (userIdentifier !== undefined && mode === undefined) {
		throwParameterError();
	}
	switch (mode) {
		case 'role':
		{
			const userRoles = user.roles;
			if (! userRoles.includes(userIdentifier)) {
				return;
			}
			break;
		}
		case 'username':
			// test if username matches, if not bail out
			if (userIdentifier !== undefined && user.username !== userIdentifier) {
				return;
			};
			break;
		default:
			if (mode !== undefined)
				throwParameterError();
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
// set icon labels to false for administrator role, true for editor
conditionalSetPreferences({namespace: 'core', key: 'showIconLabels', value: false}, 'administrator', 'role');
conditionalSetPreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'editor', 'role');
// set theme styles to true for admin username
conditionalSetPreferences({namespace: 'core/edit-post', key: 'themeStyles', value: true}, 'admin', 'username');
// set preferences for all users
conditionalSetPreferences([
	// Contain text cursor inside block
	{namespace: 'core', key: 'keepCaretInsideBlock', value: true},
	// Distraction free
	{namespace: 'core', key: 'focusMode', value: false},
	// Use theme styles
]);
