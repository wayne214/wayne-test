package com.xescm.driver;

import android.*;
import android.Manifest;
import android.app.Activity;

import android.content.Context;
import android.content.pm.PackageManager;

import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by xizhixin on 2017/8/1.
 */

public class PermissionManager extends ReactContextBaseJavaModule {

    private static final String TAG = PermissionManager.class.getSimpleName();
    private static final String SOME_GRANTED = "SOME_GRANTED";
    private static final String ALL_GRANTED = "ALL_GRANTED";
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PERMISSION_DENIED = "E_PERMISSION_DENIED";

    private static final String WRITE_EXTERNAL_STORAGE = android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
    private static final String CAMERA = android.Manifest.permission.CAMERA;
    private static final String ACCESS_FINE_LOCATION = android.Manifest.permission.ACCESS_FINE_LOCATION;
    private static final String READ_PHONE_STATE = android.Manifest.permission.READ_PHONE_STATE;
    private static final String READ_EXTERNAL_STORAGE = android.Manifest.permission.READ_EXTERNAL_STORAGE;

    private static final int REQUEST_CAMERA_CODE = 0;
    private static final int REQUEST_PHOTO_CODE = 1;
    private static final int REQUEST_LOCATION_CODE = 2;
    private static final int REQUEST_PHONE_CODE = 3;
    private static final int REQUEST_EXTERNAL_CODE = 4;

    private static HashMap<Integer, Promise> requestPromises = new HashMap<>();
    private static HashMap<Integer, WritableNativeMap> requestResults = new HashMap<>();

    public PermissionManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PermissionManager";
    }
    @ReactMethod
    public void externalPermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        int hasPermission = ContextCompat.checkSelfPermission(currentActivity, READ_EXTERNAL_STORAGE);
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(READ_EXTERNAL_STORAGE);
        } else {

            List<String> permList = new ArrayList<>();
            permList.add(READ_EXTERNAL_STORAGE);
            requestPermission(permList, currentActivity,REQUEST_EXTERNAL_CODE, promise);
        }
    }
    @ReactMethod
    public void cameraPermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }
        int hasPermission = ContextCompat.checkSelfPermission(currentActivity, CAMERA);
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(CAMERA);
        } else if(hasPermission == PackageManager.PERMISSION_DENIED) {
            promise.reject(E_PERMISSION_DENIED, "没有访问权限");
        }else {
            List<String> permList = new ArrayList<>();
            permList.add(CAMERA);
            requestPermission(permList, currentActivity, REQUEST_CAMERA_CODE, promise);
        }
    }
    @ReactMethod
    public void photoPermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        int hasPermission = ContextCompat.checkSelfPermission(currentActivity, WRITE_EXTERNAL_STORAGE);
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(WRITE_EXTERNAL_STORAGE);
        } else {
            List<String> permList = new ArrayList<>();
            permList.add(WRITE_EXTERNAL_STORAGE);
            requestPermission(permList, currentActivity, REQUEST_PHOTO_CODE, promise);
        }
    }
    @ReactMethod
    public void locationPermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        int hasPermission = ContextCompat.checkSelfPermission(currentActivity, ACCESS_FINE_LOCATION);
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(ACCESS_FINE_LOCATION);
        } else {
            List<String> permList = new ArrayList<>();
            permList.add(ACCESS_FINE_LOCATION);
            requestPermission(permList, currentActivity, REQUEST_LOCATION_CODE, promise);
        }
    }

    @ReactMethod
    public void phonePermission(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        int hasPermission = ContextCompat.checkSelfPermission(currentActivity, READ_PHONE_STATE);
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(READ_PHONE_STATE);
        } else {
            List<String> permList = new ArrayList<>();
            permList.add(READ_PHONE_STATE);
            requestPermission(permList, currentActivity, REQUEST_PHONE_CODE, promise);
        }
    }

    public void requestPermission (final List<String> permsArray, Activity currentActivity, final int reqCode, final Promise promise) {
        WritableNativeMap q = new WritableNativeMap();
        List<String> permList = new ArrayList<>();
        for (int i=0; i<permsArray.size(); i++) {
            int hasPermission = ContextCompat.checkSelfPermission(currentActivity, permsArray.get(i));
            if(hasPermission != PackageManager.PERMISSION_GRANTED) {
                permList.add(permsArray.get(i)); // list to request
                q.putBoolean(permsArray.get(i), false);
            } else {
                q.putBoolean(permsArray.get(i), true); // already granted
            }
        }

        if(permList.size() > 0) {
            requestPromises.put(reqCode, promise);
            requestResults.put(reqCode, q);

            String[] perms = permList.toArray(new String[permList.size()]);
            ActivityCompat.requestPermissions(currentActivity, perms, reqCode);
        }
        else {
            WritableNativeMap result = new WritableNativeMap();
            result.putString("code", ALL_GRANTED);
            result.putMap("result", q);
            promise.resolve(result);
        }
    }

    protected static void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if(requestPromises.containsKey(requestCode) && requestResults.containsKey(requestCode)) {
            Promise promise = requestPromises.get(requestCode);
            WritableNativeMap q = requestResults.get(requestCode);
            for(int i=0; i<permissions.length; i++) {
                q.putBoolean(permissions[i], grantResults[i] == PackageManager.PERMISSION_GRANTED);
            }

            int countGranted = 0;
            int totalPerms = 0;
            ReadableMapKeySetIterator itr = q.keySetIterator();
            while(itr.hasNextKey()) {
                String permKey = itr.nextKey();
                if(q.hasKey(permKey) && q.getBoolean(permKey) == true)
                {
                    countGranted++;
                }
                totalPerms++;
            }

            if(countGranted > 0) {
                WritableNativeMap result = new WritableNativeMap();
                result.putString("code", countGranted == totalPerms ? ALL_GRANTED : SOME_GRANTED);
                result.putMap("result", q);

                promise.resolve(result); // some or all of permissions was granted...
            }
            else {
                promise.reject(E_PERMISSION_DENIED, "Permission request denied");
            }

            requestPromises.remove(requestCode);
            requestResults.remove(requestCode);
        }

    }
}

