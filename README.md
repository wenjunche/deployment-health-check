# OpenFin Service Deployment Health Check

A sample page to show health of some webservices deployed at OpenFin.

## Files

* urls.json: metadata for webservices, including URLs.  CORS needs to be enabled for any endpoint in order for health check to work properly.
* pinger.js: performs health checks with ```fetch``` API for all URLs listed in urls.json.
* styles.css: CSS styles
* index.html: main page.

An example of this page is available [here](https://cdn.openfin.co/health/deployment/index.html).