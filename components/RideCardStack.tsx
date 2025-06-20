import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import FloatingRideCard, { FloatingRideCardProps } from './FloatingRideCard';

interface RideCardStackProps {
  rides: FloatingRideCardProps['ride'][];
  onAccept: (id: string) => void;
  onBargain: (id: string, newFare: number) => void;
  onReject: (id: string) => void;
}

const CARD_HEADER_HEIGHT = 60; // Height of the visible header for stacking
const CARD_VERTICAL_OFFSET = 70; // or whatever height shows the info you want
const CARD_SCALE_STEP = 0.01;
const TIMER_DURATION = 20;

const RideCardStack: React.FC<RideCardStackProps> = ({ rides, onAccept, onBargain, onReject }) => {
  // State for each card: timer and slider
  const [cardStates, setCardStates] = useState<{
    [rideId: string]: { timer: number; sliderValue: number }
  }>({});
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Initialize state for new rides
  useEffect(() => {
    setCardStates(prev => {
      const newState = { ...prev };
      rides.forEach(ride => {
        if (!newState[ride.id]) {
          newState[ride.id] = {
            timer: TIMER_DURATION,
            sliderValue: ride.baseFare,
          };
        }
      });
      // Remove state for rides that are gone
      Object.keys(newState).forEach(id => {
        if (!rides.find(r => r.id === id)) {
          delete newState[id];
        }
      });
      return newState;
    });
    // If no active card or active card was removed, set first card as active
    if (!activeCardId || !rides.find(r => r.id === activeCardId)) {
      setActiveCardId(rides[0]?.id || null);
    }
  }, [rides]);

  // Timer effect for each card independently
  useEffect(() => {
    const intervals: { [rideId: string]: NodeJS.Timeout } = {};
    rides.forEach(ride => {
      if (cardStates[ride.id] && cardStates[ride.id].timer > 0) {
        intervals[ride.id] = setInterval(() => {
          setCardStates(prev => {
            if (!prev[ride.id] || prev[ride.id].timer <= 0) return prev;
            return {
              ...prev,
              [ride.id]: {
                ...prev[ride.id],
                timer: prev[ride.id].timer - 1,
              },
            };
          });
        }, 1000);
      }
    });
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [rides, cardStates]);

  // Auto-reject when timer hits 0 (per card)
  useEffect(() => {
    rides.forEach(ride => {
      const state = cardStates[ride.id];
      if (state && state.timer === 0) {
        onReject(ride.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardStates, onReject, rides]);

  // Slider change handler
  const handleSliderChange = (rideId: string, value: number) => {
    setCardStates(prev => {
      if (!prev[rideId] || prev[rideId].sliderValue === value) return prev;
      return {
        ...prev,
        [rideId]: {
          ...prev[rideId],
          sliderValue: value,
        },
      };
    });
  };

  // Accept/Bargain logic
  const handleAcceptOrBargain = (ride: FloatingRideCardProps['ride']) => {
    const state = cardStates[ride.id];
    if (!state) return;
    if (state.sliderValue !== ride.baseFare) {
      onBargain(ride.id, Math.round(state.sliderValue));
    } else {
      onAccept(ride.id);
    }
  };

  // Button text logic
  const getButtonText = (ride: FloatingRideCardProps['ride']) => {
    const state = cardStates[ride.id];
    if (!state) return 'Accept';
    return state.sliderValue !== ride.baseFare ? 'Bargain' : 'Accept';
  };

  // Fare logic
  const getDisplayFare = (ride: FloatingRideCardProps['ride']) => {
    const state = cardStates[ride.id];
    return state ? Math.round(state.sliderValue) : Math.round(ride.baseFare);
  };

  // Card press handler
  const handleCardPress = (rideId: string) => {
    setActiveCardId(rideId);
  };

  // Always render all cards in order, bottom to top (last is topmost)
  const sortedRides = [...rides];
  // The active card should be last (topmost)
  if (activeCardId) {
    const activeIdx = sortedRides.findIndex(r => r.id === activeCardId);
    if (activeIdx > -1) {
      const [activeRide] = sortedRides.splice(activeIdx, 1);
      sortedRides.push(activeRide);
    }
  }

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        minHeight: 220,
        marginTop: 12,
        marginBottom: 8,
        justifyContent: sortedRides.length === 1 ? 'center' : 'flex-start', // Center if only one card
      }}
    >
      {sortedRides.map((ride, idx) => {
        const state = cardStates[ride.id] || { timer: TIMER_DURATION, sliderValue: ride.baseFare };
        const isActive = idx === sortedRides.length - 1;
        // Only apply offset if more than one card
        const translateY = sortedRides.length === 1 ? 0 : idx * CARD_VERTICAL_OFFSET;
        const zIndex = idx;
        return (
          <FloatingRideCard
            key={ride.id}
            ride={ride}
            timer={state.timer}
            fare={getDisplayFare(ride)}
            sliderValue={state.sliderValue}
            onSliderChange={value => handleSliderChange(ride.id, value)}
            buttonText={getButtonText(ride)}
            onReject={() => onReject(ride.id)}
            onAcceptOrBargain={() => handleAcceptOrBargain(ride)}
            zIndex={zIndex}
            translateY={translateY}
            scale={1}
            isActive={isActive}
            onClick={() => handleCardPress(ride.id)}
            singleCard={sortedRides.length === 1}
          />
        );
      })}
    </View>
  );
};

export default RideCardStack; 