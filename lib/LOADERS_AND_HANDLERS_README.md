# MVC loaders and handlers

The loaders and handlers herein are a bit confusing - they confuse me - so I thought I'd try to document the logic.

Directories are *detected* by a __handler__ which calls a __loader__ of the dame name. So:

* the `actions_handler` detects folders ending in 'actions' and calls an `actions_loader` to `load()` these folders.
* the `actions_loader` has an `action_handler` attached to it.
* the `action_handler` detects all folders and calls an `action_handler` to `load()` those folders.
* the `action_loader` detects a variety of resources, including the `action_script` and the `action_config`.
* each action is saved into the $actions model of the apiary dataspace.