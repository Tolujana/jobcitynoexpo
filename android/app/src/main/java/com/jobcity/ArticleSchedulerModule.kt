package com.jobcity

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.job.JobInfo
import android.app.job.JobParameters
import android.app.job.JobScheduler
import android.app.job.JobService
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.AsyncTask
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class ArticleSchedulerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val jobId = 123

    override fun getName(): String {
        return "ArticleScheduler"
    }

    @ReactMethod
    fun scheduleJob() {
        val componentName = ComponentName(reactApplicationContext, ArticleJobService::class.java)
        val jobInfo = JobInfo.Builder(jobId, componentName)
            .setPeriodic(TimeUnit.HOURS.toMillis(1))
            .setPersisted(true)
            .build()
        val jobScheduler = reactApplicationContext.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
        jobScheduler.schedule(jobInfo)
    }

    @ReactMethod
    fun rescheduleJob() {
        val jobScheduler = reactApplicationContext.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
        jobScheduler.cancel(jobId)
        scheduleJob()
    }

    class ArticleJobService : JobService() {
        private lateinit var sharedPrefs: SharedPreferences

        override fun onCreate() {
            super.onCreate()
            sharedPrefs = getSharedPreferences("ArticlePrefs", Context.MODE_PRIVATE)
        }

        override fun onStartJob(params: JobParameters?): Boolean {
            AsyncTask.execute {
                queryApis()
                jobFinished(params, true)
            }
            return true
        }

        override fun onStopJob(params: JobParameters?): Boolean {
            return true
        }

        private fun queryApis() {
            val client = OkHttpClient()
            val urls = getApiUrls()
            for (url in urls) {
                // val request = Request.Builder().url(url).build()
                // client.newCall(request).execute().use { response ->
                //     if (response.isSuccessful) {
                //         val responseBody = response.body?.string()
                //         if (responseBody != null) {
                //             val json = JSONObject(responseBody)
                //             val title = json.optString("title")
                //             if (title.isNotEmpty()) {
                //                 checkAndNotifyNewArticle(url, title)
                //             }
                //         }
                //     }
                // }
                checkAndNotifyNewArticle(url, url)
            }
        }

        private fun getApiUrls(): List<String> {
            // Fetch API URLs from SharedPreferences or any other persistent storage
            val urls = sharedPrefs.getStringSet("apiList", emptySet())
            return urls?.toList() ?: emptyList()
        }

        private fun checkAndNotifyNewArticle(url: String, title: String) {
            // val previousTitle = sharedPrefs.getString(url, "")
            // if (title != previousTitle) {
            //     sharedPrefs.edit().putString(url, title).apply()
            //     sendNotification(url, title)
            // }
            sendNotification(url, title)
        }

        private fun sendNotification(url: String, title: String) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channelId = "article_channel"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(channelId, "Article Updates", NotificationManager.IMPORTANCE_DEFAULT)
                notificationManager.createNotificationChannel(channel)
            }

            val intent = Intent(this, MainActivity::class.java).apply {
                action = Intent.ACTION_VIEW
                // data = Uri.parse("yourapp://article?title=$title&url=$url")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)

            val notification = NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("New Article")
                .setContentText("itworked")
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .build()

            notificationManager.notify(url.hashCode(), notification)
        }
    }
}
