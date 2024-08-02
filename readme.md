# Editor tweak plugin

## An example to showcase setting editor preferences based on user data

1. This is a WordPress plugin. Create a new folder in wp-content/plugins and put `my-plugin.php` and `editor-tweak.js` there. `editor-tweak-role-examples.js` is not needed, it is just a backup copy, because original request was to change preferences according to user roles and this may help someone as showcase in future
2. Activate plugin in WordPress

## Usage

You can call function with a single namespace-key-value triple, then it sets just one preference. As a second parameter, put username if you want to limit setting this preference just for this username.

```
setUsernamePreferences({namespace: 'core', key: 'showIconLabels', value: true}, 'admin');
```

You can call function with multiple triplets, all triplets are objects, but these objects are inside array. Here, second parameter of the function is omitted, which means these preferences will be set for all users.

```
setUsernamePreferences([
	{namespace: 'core', key: 'keepCaretInsideBlock', value: true},
	{namespace: 'core', key: 'focusMode', value: false},
	{namespace: 'core/edit-post', key: 'themeStyles', value: true},
]);

```