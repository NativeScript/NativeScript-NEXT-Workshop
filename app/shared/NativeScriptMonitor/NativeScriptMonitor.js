var http = require('http'),
    LocationManager = require('location').LocationManager,
    analytics = require('./EqatecMonitor'),
    deviceInfo = require('./DeviceInfo'),
    UserPreferences = require('application-settings');

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

exports.Monitor = function(settings) {
    'use strict';

    var eqatecSettings = global._eqatec.createSettings(settings.productId);

    eqatecSettings.productId = settings.productId;
    eqatecSettings.serverUri = settings.serverUri;
    eqatecSettings.version = settings.version;
    eqatecSettings.useHttps = settings.useHttps;
    eqatecSettings.loggingInterface = settings.loggingInterface;

    eqatecSettings.useCookies = false;
    eqatecSettings.userAgent = deviceInfo.userAgent;
    eqatecSettings.environmentInfo = deviceInfo.environmentInfo;

    // NativeScript already exports XMLHttpRequest in the http module
    // we only need to add the withCredentials property here so that the EqatectMonitor class uses it
    if (!('withCredentials' in XMLHttpRequest) || typeof xhrRequest.withCredentials === 'undefined') {
        XMLHttpRequest.prototype.withCredentials = false;
    }

    var locationManager = new LocationManager();
    var location = { latitude: '', longitude: '' };
    if (locationManager.lastKnownLocation) {
        location.latitude = locationManager.lastKnownLocation.latitude;
        location.longitude = locationManager.lastKnownLocation.longitude;
    }
    eqatecSettings.location = location;

    var monitor = global._eqatec.createMonitor(eqatecSettings);

    var userId = UserPreferences.getString('analytics-user-id');
    if (typeof userId === 'undefined' || userId === null) {
        userId = generateUUID();
        UserPreferences.setString('analytics-user-id', userId);
    }

    monitor.setUserID(userId);
    return monitor;
};