package com.battron;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.NativeModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MyPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
            new MyNotificationModule(reactContext),
            new ReactNativePushNotificationPackage()  // Add this line
        );
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
