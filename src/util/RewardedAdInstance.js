import {
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-7993847549836206/6722594982';

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  requestNonPersonalizedAdsOnly: false, // Set to true for non-personalized ads
});

const rewardedIntId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-7993847549836206/8455249718';

const rewardedInterstitial =
  RewardedInterstitialAd.createForAdRequest(rewardedIntId);

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-7993847549836206/6994945775';

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: false,
  videoOptions: {
    startMuted: true, // This mutes the video ads
  },
});

export const loadRewardedAd = () => {
  if (!rewarded.loaded) {
    console.log('not loaded rewarded');
    rewarded.load();
  } else {
    console.log('loaded interstitial');
  }
};

export const loadInterstitialAd = () => {
  if (!interstitialAd.loaded) {
    console.log('not loaded rewarded');
    interstitialAd.load();
  } else {
    console.log('loaded interstitial');
  }
};

export const loadRewardedIntAd = () => {
  if (!rewardedInterstitial.loaded) {
    console.log('not loaded interstitia');
    rewardedInterstitial.load();
  } else {
    console.log('loaded interstitial');
  }
};

export {rewarded, rewardedInterstitial, interstitialAd, RewardedAdEventType};
