package com.battron;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BatteryModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public BatteryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BatteryModule";
    }

    @ReactMethod
    public void setPresetBatteryLevel(int level) {
        Intent serviceIntent = new Intent(reactContext, BatteryService.class);
        serviceIntent.putExtra("presetBatteryLevel", level);
        reactContext.startService(serviceIntent);
    }

    @ReactMethod
    public void startBatteryService(int level) {
        Intent serviceIntent = new Intent(reactContext, BatteryService.class);
        serviceIntent.putExtra("presetBatteryLevel", level);
        reactContext.startForegroundService(serviceIntent);
    }

    @ReactMethod
    public void deactivateBatteryService() {
        Intent serviceIntent = new Intent(reactContext, BatteryService.class);
        serviceIntent.setAction("DEACTIVATE");
        reactContext.startService(serviceIntent);
    }
}
