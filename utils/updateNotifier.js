const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

function updateNotifier() {
  // check if a new version of ncu is available and print an update notification
  const notifier = updateNotifier({ pkg });
  if (notifier.update && notifier.update.latest !== pkg.version) {
    notifier.notify({ defer: false });
  }
}

module.exports = updateNotifier;