package com.hotnigerianjobs

import android.content.Context
import android.os.PowerManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BatteryOptimizationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val context: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "BatteryOptimization"
    }

    @ReactMethod
    fun isBatteryOptimizationDisabled(promise: Promise) {
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            val packageName = context.packageName
            val isDisabled = powerManager.isIgnoringBatteryOptimizations(packageName)
            promise.resolve(isDisabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
