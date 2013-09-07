0.0.1 The foundational systems for hive-mvc
 * frames
 * hives
 * multiple static directory management
 * layout system (in test_resources).
 * actions
   - waterfall driven action processing
   - contexts
 * resources - view_resources, mixins, models
 * fully functioning loader via hive-loader
 * integration with hive-mvc
 * event driven management of addition of resources
 * Apiary for central coordination
 * Decent test coverage

0.0.1a
 * altered context management (context.out -> context.$out)

0.0.1b
 * altered bootstrap; now triggering mxiins during the serve phase.
 * test coverage cauterized to run; more coverage needed...

0.0.1c
 * removed spawn to hive-queen

0.0.1d
 * allowed root_route in hive or apiary for relative frame routing; also applies to static paths

0.0.1e
 * Some refactoring of request, mixin code for readability

0.0.1j
 * Allowing for filtered loading of selective frames

0.0.2
  * supporting new core requirements for hive-loader

0.0.3
  * adding internal logging;
  * adding "kill switch" for long action

0.1.0
Setting production release mark. Locking down versions of critical components

0.1.1
Emitting message on mixin load to allow for deferred execution of code based on loaded mixins