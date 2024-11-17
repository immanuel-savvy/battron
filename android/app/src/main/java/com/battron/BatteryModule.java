package com.battron;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class BatteryModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public BatteryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BatteryModule";
    }

    @ReactMethod
    public void getBatteryPercentage(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = context.registerReceiver(null, intentFilter);

            if (batteryStatus != null) {
                int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

                if (level != -1 && scale != -1) {
                    float batteryPercentage = ((float) level / (float) scale) * 100;
                    promise.resolve(batteryPercentage);
                } else {
                    promise.reject("ERROR", "Unable to fetch battery level.");
                }
            } else {
                promise.reject("ERROR", "Battery status is null.");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
