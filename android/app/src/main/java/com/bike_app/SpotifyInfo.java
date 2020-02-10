package com.bike_app;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.PlayerApi;
import com.spotify.android.appremote.api.SpotifyAppRemote;

import com.spotify.protocol.client.Subscription;
import com.spotify.protocol.types.PlayerState;
import com.spotify.protocol.types.Track;

public class SpotifyInfo extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;

    private static final String CLIENT_ID = "3ec3064e4dfc4b78b14b72ad3e914c2c";
    private static final String REDIRECT_URI = "http://com.bike_app/callback";
    private SpotifyAppRemote mSpotifyAppRemote;
    private PlayerApi mPlayerApi;

    public SpotifyInfo(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SpotifyInfo";
    }

    @ReactMethod
    public void sampleMethod() {
        WritableMap params = Arguments.createMap();
        params.putString("test", "called");
        sendEvent(reactContext, "Test", params);
        Log.d("MUSIC", "CALLED");
    }

    @ReactMethod
    public void startService() {
        ConnectionParams connectionParams =
                new ConnectionParams.Builder(CLIENT_ID)
                        .setRedirectUri(REDIRECT_URI)
                        .showAuthView(true)
                        .build();

        SpotifyAppRemote.connect(reactContext, connectionParams,
                new Connector.ConnectionListener() {

                    @Override
                    public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                        mSpotifyAppRemote = spotifyAppRemote;
                        Log.d("MUSIC", "Connected!");
                        connected();
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        Log.e("MUSIC", throwable.getMessage(), throwable);
                    }
                });
    }

    private void connected(){
        mPlayerApi = mSpotifyAppRemote.getPlayerApi();
        mPlayerApi.subscribeToPlayerState()
                .setEventCallback(playerState -> {
                    final Track track = playerState.track;
                    if (track != null) {
                        Log.d("MUSIC", track.name + " by " + track.artist.name + " " + track.duration);
                        WritableMap params = Arguments.createMap();
                        params.putString("track_name", track.name);
                        params.putString("artist_name", track.artist.name);
                        params.putDouble("track_length", track.duration);
                        sendEvent(reactContext, "SongUpdate", params);
                    }
                    Log.d("MUSIC", "isPaused: " + playerState.isPaused + " position: " + playerState.playbackPosition);
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("isPaused", playerState.isPaused);
                    params.putDouble("position", playerState.playbackPosition);
                    sendEvent(reactContext, "PosUpdate", params);
                });
    }

    private void sendEvent(ReactApplicationContext reactContext,
                           String eventName,
                           WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        SpotifyAppRemote.disconnect(mSpotifyAppRemote);
    }
}
