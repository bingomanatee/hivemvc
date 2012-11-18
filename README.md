hivemvc
=======

the next evolution of nuby-express; an advanced, RAD environment for Express sites.

Nuby Express has proven successful at managing large projects; however it did not load (not respond, load) fast enough for Nodejitsu and it had issues with require pathing.

HiveMVC is going to address some of the failings of NE and provide additional functionality:

* The ability to attach itself to an existing Express.js project
* The ability to launch and add actions to a running project
* Better ability to respond at any point in the loading process
* The ability to mock data sets and cache results for "de facto" unit tests
* Abstracting responses from HTTP to model expert / non-http systems
* The ability to "hot swap" patches to a working system.
* A complete data backup and import system to enable transport of data between local and remote systems.
* A simpler hierarchy of containers above the Action level
* A reconsideration of static serving to bind static directories to specific components, allowing for functional filtering of static data
* A callback-centric pipeline inside actions.

