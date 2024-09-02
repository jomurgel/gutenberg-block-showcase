const glob = require('glob');
const path = require('path');
const { getWebpackEntryPoints } = require('@wordpress/scripts/utils');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');


// Set the block entrypoints.
const blockEntryPoints = getWebpackEntryPoints();

// Support locations.
const locations = ['filters', 'sidebars', 'slotfills'];

// Directory exclusions
const exclusions = ['components', 'assets', 'store', 'utils', 'services'];

/**
 * Get support entry points.
 *
 * @return {Array} Support entrypoints.
 */
const support = glob
  .sync(`./src/{${locations.join(',')}}/**/*.js*`)
  .reduce((acc, item) => {
    const pathObject = path.parse(item);
    const ext = pathObject?.ext;
    const dir = pathObject?.dir;

    // Ignore json files and allow either named files or index (not components or utils).
    if (
      ext !== '.json' &&
      !dir
        .split('/')
        .some((pathName) => exclusions.includes(pathName))
    ) {
      acc[dir.replace('./src/', '') + '/index'] = item;
    }

    return acc;
  }, []);

/**
 * Cast to variable so we can extend this more later.
 */
const config = {
  ...defaultConfig,
  entry: {
    ...blockEntryPoints,
    ...support,
  },
};

module.exports = config;
