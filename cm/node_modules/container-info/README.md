# container-info

Parse container info from cgroups file.

## Install

```sh
npm install container-info
```

## Usage

```js
const getContainerInfo = require('container-info')

// Sync
const { containerId, podId } = getContainerInfo.sync()
console.log({ containerId, podId })

// Async
getContainerInfo().then(({ containerId, podId }) => {
  console.log({ containerId, podId })
})

// Parse cgroup file contents
const { containerId, podId } = getContainerInfo.parse(`
  1:name=systemd:/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod90d81341_92de_11e7_8cf2_507b9d4141fa.slice/crio-2227daf62df6694645fee5df53c1f91271546a9560e8600a525690ae252b7f63.scope
`)
```
