# recruiter_blocker
Firefox extension to remove recruitment agencies (and other specific companies) from LinkedIn job search results.

## Features

- **Block companies** - click the X button on any job card to block that company, or add them manually via the popup
- **Unblock companies** - remove a company from the block list via the popup
- **Mute/unmute** - temporarily disable blocking for a company without removing it from the list
- **Block individual jobs** - hide specific job listings by ID
- **Live filtering** - automatically catches dynamically loaded job cards as you scroll

## Install

### Temporary (for development/testing)

1. Clone this repo
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file in the root of this repo
5. Navigate to LinkedIn job search — the extension is now active

> Note: Temporary add-ons are removed when Firefox closes.

### Permanent (unsigned)

1. Open Firefox and navigate to `about:config`
2. Set `xpinstall.signatures.required` to `false` (Developer/Nightly editions only)
3. Zip the extension files: `zip -r recruiter_blocker.xpi manifest.json src/`
4. Open `about:addons`, click the gear icon, and select **Install Add-on From File...**
5. Select the `.xpi` file

### Permanent (signed via AMO)

1. Create an account at [addons.mozilla.org](https://addons.mozilla.org)
2. Submit the extension for signing
3. Install the signed `.xpi` file via `about:addons`

## Usage

1. Go to [LinkedIn Jobs](https://www.linkedin.com/jobs/)
2. Hover over any job card to reveal the block button (X) in the top-right corner
3. Click it to block that company from all results
4. Click the extension icon in the toolbar to manage your block list — add, remove, or mute companies

## Running tests

```
npm install
npm test
```
