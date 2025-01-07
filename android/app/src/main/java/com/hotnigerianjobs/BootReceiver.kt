package com.hotnigerianjobs

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            context?.let {
                val articleSchedulerModule = ArticleSchedulerModule(ReactApplicationContext(it))
                articleSchedulerModule.scheduleJob()
            }
        }
    }
}
