# android-version-action v1.2
Override your android version number and version code through github actions

## Features
* Override version number to bump version through github actions
* Override version name

## Parameters
`gradlePath`
**Required**, File path to the **Path to the build.gradle file** so that it knows where to find the file that contains the versionCode and versionName attributes.

`mergeVersionCode`
**Optional**, Whether or not to combine existing versionCode with the one specified in the action

`versionCode`
**Optional**, Version Code to override

`versionName`
**Optional**, Version Name to override

## Example
```
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: set up JDK 1.8
        uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Bump version
        uses: chkfung/android-version-actions@v1.1
        with:
          gradlePath: app/build.gradle # or app/build.gradle.kts 
          mergeVersioncode: true
          versionCode: ${{github.run_number}}
          versionName: 1.0.0
```
