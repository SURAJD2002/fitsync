package com.fitsync.app;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "ActivityTracker",
    permissions = {
        @Permission(
            strings = { Manifest.permission.ACTIVITY_RECOGNITION },
            alias = "activityRecognition"
        )
    }
)
public class ActivityTrackerPlugin extends Plugin implements SensorEventListener {

    private static final String TAG = "FitSyncActivityTracker";
    private SensorManager sensorManager;
    private Sensor stepCounterSensor;
    private Sensor stepDetectorSensor;

    private boolean isTracking = false;
    private long latestRawSteps = -1;
    private long lastReadingTimestamp = 0;

    @Override
    public void load() {
        super.load();
        Context context = getContext();
        if (context != null) {
            sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
            if (sensorManager != null) {
                stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
                stepDetectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
                Log.d(TAG, "Sensors initialized. Counter: " + (stepCounterSensor != null) + ", Detector: " + (stepDetectorSensor != null));
            }
        }
    }

    @PluginMethod
    public void checkAvailability(PluginCall call) {
        JSObject ret = new JSObject();
        boolean hasCounter = (stepCounterSensor != null);
        boolean hasDetector = (stepDetectorSensor != null);
        ret.put("isAvailable", hasCounter || hasDetector);
        ret.put("hasStepCounter", hasCounter);
        ret.put("hasStepDetector", hasDetector);
        call.resolve(ret);
    }

    @PluginMethod
    public void getPermissionStatus(PluginCall call) {
        JSObject ret = new JSObject();
        boolean granted = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
        }
        ret.put("granted", granted);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACTIVITY_RECOGNITION) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("activityRecognition", call, "activityRecognitionCallback");
                return;
            }
        }
        JSObject ret = new JSObject();
        ret.put("granted", true);
        call.resolve(ret);
    }

    @PermissionCallback
    private void activityRecognitionCallback(PluginCall call) {
        boolean granted = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
        }
        JSObject ret = new JSObject();
        ret.put("granted", granted);
        call.resolve(ret);
    }

    @PluginMethod
    public void startTracking(PluginCall call) {
        if (sensorManager == null) {
            call.reject("SensorManager not available");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACTIVITY_RECOGNITION) != PackageManager.PERMISSION_GRANTED) {
                call.reject("ACTIVITY_RECOGNITION permission required");
                return;
            }
        }

        if (!isTracking) {
            boolean registered = false;
            if (stepCounterSensor != null) {
                registered = sensorManager.registerListener(this, stepCounterSensor, SensorManager.SENSOR_DELAY_NORMAL);
            }
            if (!registered && stepDetectorSensor != null) {
                registered = sensorManager.registerListener(this, stepDetectorSensor, SensorManager.SENSOR_DELAY_NORMAL);
            }

            isTracking = registered;
            Log.d(TAG, "Sensor registration status: " + isTracking);
        }

        JSObject ret = new JSObject();
        ret.put("isTracking", isTracking);
        ret.put("latestRawSteps", latestRawSteps);
        call.resolve(ret);
    }

    @PluginMethod
    public void stopTracking(PluginCall call) {
        if (sensorManager != null && isTracking) {
            sensorManager.unregisterListener(this);
            isTracking = false;
        }
        JSObject ret = new JSObject();
        ret.put("isTracking", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void getLatestSensorReading(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("rawSteps", latestRawSteps);
        ret.put("timestamp", lastReadingTimestamp);
        ret.put("isTracking", isTracking);
        call.resolve(ret);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null || event.values.length == 0) return;

        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            long rawSteps = (long) event.values[0];
            latestRawSteps = rawSteps;
            lastReadingTimestamp = System.currentTimeMillis();

            JSObject data = new JSObject();
            data.put("rawSteps", rawSteps);
            data.put("timestamp", lastReadingTimestamp);
            data.put("sensorType", "TYPE_STEP_COUNTER");
            notifyListeners("stepUpdate", data);
        } else if (event.sensor.getType() == Sensor.TYPE_STEP_DETECTOR) {
            // Step detector triggers 1.0 on every individual step event
            if (latestRawSteps == -1) latestRawSteps = 0;
            latestRawSteps += 1;
            lastReadingTimestamp = System.currentTimeMillis();

            JSObject data = new JSObject();
            data.put("rawSteps", latestRawSteps);
            data.put("timestamp", lastReadingTimestamp);
            data.put("sensorType", "TYPE_STEP_DETECTOR");
            notifyListeners("stepUpdate", data);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No-op for step counter accuracy changes
    }

    @Override
    protected void handleOnDestroy() {
        if (sensorManager != null && isTracking) {
            sensorManager.unregisterListener(this);
            isTracking = false;
        }
        super.handleOnDestroy();
    }
}
