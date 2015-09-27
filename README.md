artifact-store
==============

[![Build Status](https://travis-ci.org/wblankenship/artifact-store.svg?branch=master)](https://travis-ci.org/wblankenship/artifact-store)

A generic artifact store. Allows you to store and fetch artifacts with pinned versions.

# Usage

To store something, simply:

`POST /[user]/[package]/[version]`

with the artifact as the request body (think tarballs). Where:

* `user` is the username for a scoped artifact. If absent, the package will be uploaded to the global namespace.
* `package` is the name of the artifact
* `version` is the version of the artifact

To get something back out, simply:

`GET /[user]/[package]/[version]`

# Output

The output is generated from [bole](npmjs.org/package/bole). We currently offer no way to override this, but it may eventually be extendable through the config file. If you want to make it pretty, try piping `stderr` and `stdout` into a bole consumer.

# Configuration

You can specify a config file that overrides the default behaviour of this application. To learn how, refer to the [`node-config`](https://github.com/lorenwest/node-config) documentation.

If you are interested, here is the default config:

```json
{
  "registry" : {
    "type" : "fs",
    "path" : "/tmp/artifacts"
  },
  "server" : {
    "port" : 8765
  }
}
```

Currently, we only support `fs` as a registry type. If you leave `path` out, it will select a random directory in `/tmp` which isn't great for reusability.

# Scaling

Currently, you can only scale vertically with this service since it writes to the local fs.

For performance, we recommend you serve `GET` requests to the `registry.path` directory from [Nginx](nginx.com) since it handles that sort of thing better than Node.

# Important notes:

This isn't production ready. It currently offers no verification of uploaded artifacts, has no authentication, and allows you to overwrite previously uploaded artifacts which tends to be a big no-no.
