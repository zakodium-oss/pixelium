# pixelium

A React component for displaying and processing raster images.

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

[![build status][ci-image]][ci-url]
[![license][license-image]][license-url]

</h3>

## Installation

TBD

## Demo

https://pixelium.zakodium.com/

## Documentation

Including Pixelium in your project is as simple as:

```jsx
<Pixelium />
```

You also can use a WebSource from [filelist-utils](https://github.com/cheminfo/filelist-utils) to load images from a remote server:

```jsx
<Pixelium webSource={source} />;
```

It's also possible to pass wanted data, preferences or view data as initial values to the component:

```jsx
<Pixelium
  data={data}
  preferences={preferences}
  view={view}
/>
```

Another example of usage is available in the [demo source code](https://github.com/zakodium-oss/pixelium/blob/main/src/demo/views/MainView.tsx).


## Licensing

This software is licensed under the [MIT license](https://github.com/zakodium-oss/pixelium/blob/main/LICENSE). All rights reserved.

<table border="0">
 <tr>
    <td><img src="https://github.com/zakodium-oss/pixelium/assets/2575182/f1907231-8d61-4876-8317-85991c6e0369" /></td>
    <td><img src="https://github.com/zakodium-oss/pixelium/assets/2575182/4438d79f-7d45-4493-ba69-b506fc9790e9" /></td>
 </tr>
</table>


[ci-image]: https://img.shields.io/github/actions/workflow/status/zakodium-oss/pixelium/code-quality.yml
[ci-url]: https://github.com/zakodium-oss/pixelium/actions/workflows/code-quality.yml
[license-image]: https://img.shields.io/github/license/zakodium-oss/pixelium.svg
[license-url]: https://github.com/zakodium-oss/pixelium/blob/main/LICENSE
