package com.battron;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.battron.MainActivity;  // Ensure this import is correct
import com.battron.R;  // Ensure this import is correct

public class MyNotificationModule extends ReactContextBaseJavaModule {

    private static final String CHANNEL_ID = "DefaultChannel";
    private static final String CHANNEL_NAME = "Default Channel";
    private static final String TAG = "MyNotificationModule";

    public MyNotificationModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        createNotificationChannel(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MyNotificationModule";
    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH  // Set the importance to high for visibility
            );
            channel.setDescription("A default channel for notifications");
            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(channel);
                Log.d(TAG, "Notification channel created");
            } else {
                Log.e(TAG, "Notification manager is null");
            }
        }
    }

    @ReactMethod
    public void showNotification(String title, String message) {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, MainActivity.class);  // Ensure MainActivity is correctly referenced
        
        PendingIntent pendingIntent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        } else {
            pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)  // Ensure ic_notification exists in res/drawable
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)  // Set the priority to high for visibility
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(1, builder.build());
            Log.d(TAG, "Notification displayed: " + title + " - " + message);
        } else {
            Log.e(TAG, "Notification manager is null");
        }
    }
}
