# Automated Accessibility

A HTML-focussed Automated Accessibility Testing framework that leverages [Pa11y](https://github.com/pa11y/pa11y).

The framework is used to scan locally saved HTML files, referred to as **snapshots**.

Pa11y leverages the following test runners to verify the HTML:
* [aXe-core](https://www.axe-core.org/)
* [HTML CodeSniffer](http://squizlabs.github.com/HTML_CodeSniffer/)

This framework can be ran locally or embedded into CI Pipelines.

**Note that this framework focusses on HTML structure only. Visual and navigation issues will not be detected.**

## Technologies

* [NodeJS v15.8.0](https://nodejs.org/dist/v15.8.0/node-v15.8.0.pkg)
* [Pa11y](https://github.com/pa11y/pa11y)

## Environment variables

The following environment variables are available:

| Environment variable  | Description                                                                | Default      |
|-----------------------|----------------------------------------------------------------------------|---------------
| `ADDITIONAL_RULES`    | The extra accessibility rules beyond the standard to test, comma separated | []
| `CONCURRENT_TESTS`    | The maximum number of tests to run in parallel                             | 10
| `REPORT_DIRECTORY`    | The directory where the ZIP report will be output to upon test failure     | report/
| `SNAPSHOTS_DIRECTORY` | The directory where the prepared HTML snapshots are present                | snapshots/
| `STANDARD`            | The accessibility standard to test against                                 | WCAG2AA

## Running locally

To build the project:
```
npm install
npm run build
```

Ensure that the HTML snapshots to be tested are placed in the `SNAPSHOTS_DIRECTORY`.

To run the project:
```
npm start
```

### Sample output

```
** FAIL **: Hello Fail World
 file:///Users/<user>/automated-accessibility/snapshots/fail.html
 [
  {
    "Selector": "#duplicate",
    "Code": "WCAG2AA.Principle4.Guideline4_1.4_1_1.F77",
    "Message": "Duplicate id attribute value \"duplicate\" found on the web page."
  }
]

** PASS **: Hello Pass World
 file:///Users/<user>/automated-accessibility/snapshots/pass.html

Accessibility tests FAILED
```

If the accessibility tests fail, a ZIP failure report can be found in the `REPORT_DIRECTORY`

## Docker usage

A Dockerfile is available to build an image of the project.

It is recommended that volumes are mounted for the snapshots (input) and generated report (output) respectively.

**Note that Docker installs Chromium separately due to [Puppeteer's Docker compatibility](https://github.com/puppeteer/puppeteer/blob/v7.1.0/docs/troubleshooting.md#running-on-alpine)**

To build the Docker image:
```
docker build -t automated-accessibility:latest .
```

To run the Docker image with example volumes attached:
```
docker run  \
-v `pwd`/snapshots:/app/snapshots \
-v `pwd`/report:/app/report \
-e SNAPSHOTS_DIRECTORY=/app/snapshots \
-e REPORT_DIRECTORY=/app/report \
automated-accessibility:latest
```
