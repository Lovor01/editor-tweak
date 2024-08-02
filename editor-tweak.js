/**
 * Change editor defaults
 */

// all is wrapped in async function, because await is used to get suspendSelect value
// if plain select were used, we would again have to have some kind of loop to wait for its results
// because it returns undefined untill value is fetched from REST

(async () => {
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
	const userID = (await getSuspended(suspendedSelector.getCurrentUser)).id;
	const user = await getSuspended(() => suspendedSelector.getUser(userID));
	const userRoles = user.roles;
	/**
	 * you could also test capabilities by testing user.capabilities object
	 * it has form: {'install_plugins': true, 'edit_posts': true, ...}
	 * capabilities names are described here: https://wordpress.org/documentation/article/roles-and-capabilities/
	 */
	const userIsAdmin =  userRoles.includes('administrator')

	const setter = (key) => {wp.data.dispatch('core/preferences').set(
		'core',
		key,
		userIsAdmin
	)};

	// set block list to open in left sidebar, block breadcrumbs, right-click menus in list view and most used blocks in menu to show for admin. For others, not.
	// you can find other keys by installing Redux browser extension, changing preference in UI and looking at DIFF tab in core/preferences to see what has changed
	// remember to select on left side the last store getter
	keys = ['showListViewByDefault', 'showBlockBreadcrumbs', 'allowRightClickOverrides', 'mostUsedBlocks'];
	keys.forEach((key) => {
		setter(key);
	});

})();
