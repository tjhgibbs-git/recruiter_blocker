# recruiter_blocker
Firefox extension to remove recruitment agencies (and other specific companies) from LinkedIn job search results.

## Features

- **Block companies** - click the X button on any job card to block that company, or add them manually via the popup
- **Unblock companies** - remove a company from the block list via the popup
- **Mute/unmute** - temporarily disable blocking for a company without removing it from the list
- **Block individual jobs** - hide specific job listings by ID
- **Live filtering** - automatically catches dynamically loaded job cards as you scroll

## Install

```
npm install
npx web-ext run
```

This launches Firefox with the extension loaded. It auto-reloads when you edit files.

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
