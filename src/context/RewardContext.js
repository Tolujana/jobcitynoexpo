import React, {createContext, useState, useEffect} from 'react';
import {Alert} from 'react-native';

export const RewardContext = createContext();

export const RewardProvider = ({children}) => {
  const [rewardPoints, setRewardPoints] = useState(0);
  const [prevPoints, setPrevPoints] = useState(0);

  useEffect(() => {
    if (rewardPoints > 0) {
      Alert.alert(
        'Congratulations!',
        `You've earned ${rewardPoints} more points!`,
      );
    }
    setPrevPoints(rewardPoints);
  }, [rewardPoints]);

  return (
    <RewardContext.Provider value={{rewardPoints, setRewardPoints}}>
      {children}
    </RewardContext.Provider>
  );
};
