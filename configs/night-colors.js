const { AndroidConfig, withAndroidColorsNight } = require('@expo/config-plugins');
const { assignColorValue } = AndroidConfig.Colors;

module.exports = config => withAndroidColorsNight(config, async config => {
    config.modResults = assignColorValue(config.modResults, {
        name: 'colorPrimaryDark',
        value: '#000000'
    })
    return config;
})