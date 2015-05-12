express-fantasy-resource
=========================

This module allows you to write your route handlers as expressions
and it maps Promises, Options, and Eithers to obvious HTTP status code.

Types to HTTP Status Codes
---------------------------

* Left(a) -> 400, res.body = a
* Right(a) -> 200, res.body = a
* None -> 404
* Some(a) -> 200, res.body = a


Example
--------

```js
#include <example/app.js>
```
