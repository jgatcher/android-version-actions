const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

//TODO switch to typescript
// versionCode — A positive integer [...] -> https://developer.android.com/studio/publish/versioning
const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
// versionName — A string used as the version number shown to users [...] -> https://developer.android.com/studio/publish/versioning
const versionNameRegexPattern = /(versionName(?:\s|=)*)(.*)/;

try {
    const gradlePath = core.getInput('gradlePath');
    let versionCode = core.getInput('versionCode');
    const versionName = core.getInput('versionName');
    const mergeVersionCode = (core.getInput('mergeVersionCode') == 'true') ? true : false;

    console.log(`Gradle Path : ${gradlePath}`);
    console.log(`Version Code : ${versionCode}`);
    console.log(`Version Name : ${versionName}`);
    console.log(`Merge VersionCode: ${mergeVersionCode}`);

    fs.readFile(gradlePath, 'utf8', function (err, data) {
        if (err) {
            throw new Error(err.message);
        }
        newGradle = data;
        if (versionCode.length > 0) {
            if (mergeVersionCode) {
                let merged = mergeWithPreviousVersionCode(versionCode,newGradle);
                versionCode = merged
            }
        }
            
        newGradle = newGradle.replace(versionCodeRegexPattern, `$1${versionCode}`);

        if (versionName.length > 0) {
            newGradle = newGradle.replace(versionNameRegexPattern, `$1\"${versionName}\"`);
        }
            
        fs.writeFile(gradlePath, newGradle, function (err) {
            if (err) throw err;
            if (versionCode.length > 0)
                console.log(`Successfully override version code ${versionCode}`)
            if (versionName.length > 0)
                console.log(`Successfully override version code ${versionName}`)
            core.setOutput("result", `Done`);
        });
    });

} catch (error) {
    core.setFailed(error.message);
}
//TODO quick test for logic
function mergeWithPreviousVersionCode(versionCode,gradle) {
    console.log("determine new versionCode")
    let match = gradle.match(versionCodeRegexPattern);
    let currentValue = Number.parseInt(match[2])
    let proposedValue = Number.parseInt(versionCode);
    console.log(`currentValue${currentValue} proposedValue${proposedValue}`)
    if (currentValue >= proposedValue) {
        console.log("Increasing current value by 1")
        return currentValue + 1
    }
    console.log("using proposedValue as is")
    return proposedValue;
}

