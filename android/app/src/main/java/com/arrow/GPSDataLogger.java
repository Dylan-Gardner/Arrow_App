package com.arrow;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;

import com.elvishew.xlog.XLog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import mad.location.manager.lib.Commons.Utils;
import mad.location.manager.lib.Loggers.GeohashRTFilter;

/**
 * Created by lezh1k on 12/25/17.
 */

public class GPSDataLogger implements LocationListener {

    private LocationManager m_locationManager = null;
    private Context m_context = null;
    private String m_lastLoggedGPSMessage;
    private GeohashRTFilter m_geoHashRTFilter;

    public String getLastLoggedGPSMessage() {
        return m_lastLoggedGPSMessage;
    }

    public GPSDataLogger(LocationManager locationManager,
                         Context context,GeohashRTFilter geoHashRTFilter) {
        m_locationManager = locationManager;
        m_context = context;
        m_geoHashRTFilter = geoHashRTFilter;
    }

    public boolean start() {
        if (m_locationManager == null)
            return false;
        if (ActivityCompat.checkSelfPermission(m_context,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            m_locationManager.removeUpdates(this);

            m_locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
                    Utils.GPS_MIN_TIME, Utils.GPS_MIN_DISTANCE, this);
            return true;
        }
        return false;
    }

    public void stop() {
        if (m_locationManager == null)
            return;
        m_locationManager.removeUpdates(this);
    }

    public void locationChanged(Location loc) {
        m_geoHashRTFilter.filter(loc);
    }


    @Override
    public void onLocationChanged(Location loc) {
        double speedAccuracyMpS = 0.1 * loc.getAccuracy();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && loc.hasAccuracy()) {
            speedAccuracyMpS = loc.getSpeedAccuracyMetersPerSecond();
        }


        m_lastLoggedGPSMessage = String.format("GPS : pos lat=%f, lon=%f, alt=%f, hdop=%f, speed=%f, bearing=%f, sa=%f",
                loc.getLatitude(),
                loc.getLongitude(), loc.getAltitude(), loc.getAccuracy(),
                loc.getSpeed(), loc.getBearing(), speedAccuracyMpS);
        XLog.i(m_lastLoggedGPSMessage);
        String distance = String.format("KalmanDistance : %fm", m_geoHashRTFilter.getDistanceGeoFiltered());
        XLog.i(distance);
    }

    private void sendEvent(ReactApplicationContext reactContext,
                           String eventName,
                           WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public void onProviderEnabled(String provider) {
    }

    @Override
    public void onProviderDisabled(String provider) {
    }
}
