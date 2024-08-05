# Editor tweak plugin

## An example to showcase setting editor preferences based on user data

1. This is a WordPress plugin. Create a new folder in wp-content/plugins and put `my-plugin.php` and `editor-tweak.js` there. `editor-tweak-role-examples.js` is not needed, it is just a backup copy, because original request was to change preferences according to user roles and this may help someone as showcase in future
2. Activate plugin in WordPress

## Usage

You can call function with a single namespace-key-value triple, then it sets just one preference. You can also use array of preferences, as in second example. As a second parameter:
* put username if you want to limit setting this preference just for this username. As a third parameter you must use 'username'
* use role slug as a second parameter to limit this setting just for this role. As a third parameter you must use 'role'

```
setUsernamePreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'admin', 'username');
setUsernamePreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'administrator', 'role');
```

You can call function with multiple triplets, all triplets are objects, but these objects are inside array. Here, second parameter and third parameters of the function are omitted, which means these preferences will be set for all users.

```
setUsernamePreferences([
	{namespace: 'core', key: 'keepCaretInsideBlock', value: true},
	{namespace: 'core', key: 'focusMode', value: false},
	{namespace: 'core/edit-post', key: 'themeStyles', value: true},
]);

```
