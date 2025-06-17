import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import RideAlertModal from './RideAlertModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { rideService, type Ride } from '../api/rideService';

const userAvatar = require('../assets/icon.png');
const carIcon = require('../assets/icon.png');

const initialRegion = {
  latitude: 28.4711,
  longitude: 77.0736,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const STATUS_COLORS = {
  Offline: '#ef4444', // red-500
  Online: '#22c55e', // green-500
  GoHome: '#6366f1', // indigo-500
};

const MAX_VISIBLE_MODALS = 3; // Maximum number of ride alerts to show

export default function HomeScreen({ navigation }: Props) {
  const [status, setStatus] = useState<'Offline' | 'Online' | 'GoHome'>('Offline');
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [acceptedRides, setAcceptedRides] = useState<Ride[]>([]); // <-- new
  const [earnings, setEarnings] = useState(0); // <-- new
  const [showRideAlerts, setShowRideAlerts] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation logic
  const statusIndex = { Offline: 0, Online: 1, GoHome: 2 };
  const colorProgress = useSharedValue(statusIndex[status]);

  // Generate a new ride request
  const generateRideRequest = useCallback(async () => {
    try {
      // Get a random ID from 1-3 since we have 3 rides in our JSON
      const randomId = Math.floor(Math.random() * 3) + 1;
      const ride = await rideService.getRideRequest(randomId.toString());
      // Add requestStatus
      return { ...ride, requestStatus: 'pending' } as Ride;
    } catch (error) {
      console.error('Failed to fetch ride:', error);
      return null;
    }
  }, []);

  // Simulate incoming ride requests when online
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const generateRides = async () => {
      if (status === 'Online') {
        // Generate first ride only if no active rides
        if (activeRides.length === 0) {
          const initialRide = await generateRideRequest();
          if (initialRide) {
            setActiveRides([initialRide]);
            setShowRideAlerts(true);
          }
        }

        // Set up interval for new rides
        intervalId = setInterval(async () => {
          if (activeRides.length < MAX_VISIBLE_MODALS) {
            const newRide = await generateRideRequest();
            if (newRide) {
              setActiveRides(prev => {
                // Check if ride with same ID already exists
                const exists = prev.some(ride => ride.id === newRide.id);
                if (exists) return prev;
                return [...prev, newRide];
              });
              setShowRideAlerts(true);
            }
          }
        }, 10000);
      }
    };

    generateRides();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, generateRideRequest, activeRides.length]);

  React.useEffect(() => {
    colorProgress.value = withTiming(statusIndex[status], { duration: 350 });
  }, [status]);

  // Animated styles for each toggle
  const getAnimatedStyle = (btnStatus: 'Offline' | 'Online' | 'GoHome') => {
    const btnIdx = statusIndex[btnStatus];
    return useAnimatedStyle(() => {
      const isActive = colorProgress.value === btnIdx;
      const bgColor = interpolateColor(
        colorProgress.value,
        [0, 1, 2],
        [STATUS_COLORS.Offline, STATUS_COLORS.Online, STATUS_COLORS.GoHome]
      );
      return {
        backgroundColor: isActive ? bgColor : 'white',
        transform: [{ scale: isActive ? 1.02 : 1 }],
        shadowOpacity: isActive ? 0.3 : 0.1,
        shadowRadius: isActive ? 10 : 5,
      };
    });
  };

  const handleRideClose = useCallback((rideId: string) => {
    setActiveRides(prev => prev.filter(ride => ride.id !== rideId));
  }, []);

  const handleRideAccept = useCallback(async (rideId: string) => {
    try {
      const ride = activeRides.find(r => r.id === rideId);
      if (!ride) return;
      const success = await rideService.acceptRide(rideId, ride.baseFare);
      if (success) {
        // Mark as accepted
        setActiveRides(prev => prev.filter(r => r.id !== rideId));
        setAcceptedRides(prev => [...prev, { ...ride, requestStatus: 'accepted' }]);
        setEarnings(prev => prev + ride.baseFare);
        Alert.alert('Success', 'Ride accepted successfully!');
      } else {
        Alert.alert('Error', 'Failed to accept ride. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while accepting the ride.');
    }
  }, [activeRides]);

  const handleStatusChange = useCallback(async (newStatus: 'Offline' | 'Online' | 'GoHome') => {
    if (isStatusChanging) return;
    
    setIsStatusChanging(true);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus(newStatus);
      if (newStatus === 'Offline') {
        setActiveRides([]);
        setShowRideAlerts(false);
      }
    } finally {
      setIsStatusChanging(false);
      setIsLoading(false);
    }
  }, [isStatusChanging]);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-8 pb-2 bg-white rounded-b-2xl shadow">
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Welcome, Rakesh!</Text>
        <Image source={userAvatar} className="w-9 h-9 rounded-full" />
      </View>

      {/* Status Toggle */}
      <View className="mx-4 mt-4">
        <View className="bg-gray-100 p-2 rounded-2xl">
          <View className="flex-row bg-white rounded-xl p-1 shadow-sm">
            {['Offline', 'Online', 'GoHome'].map((statusType) => (
              <TouchableOpacity
                key={statusType}
                onPress={() => handleStatusChange(statusType as 'Offline' | 'Online' | 'GoHome')}
                disabled={isStatusChanging}
                className={`flex-1 ${status === statusType ? '' : 'opacity-50'}`}
              >
                <Animated.View
                  style={[getAnimatedStyle(statusType as 'Offline' | 'Online' | 'GoHome')]}
                  className="py-3 px-2 rounded-lg"
                >
                  <View className="flex-row items-center justify-center space-x-2">
                    <View className={`p-2 rounded-full ${
                      status === statusType ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      <Ionicons
                        name={
                          statusType === 'Offline' ? 'power' :
                          statusType === 'Online' ? 'radio' : 'home'
                        }
                        size={18}
                        color={status === statusType ? 'white' : '#666'}
                      />
                    </View>
                    <Text className={`font-semibold ${
                      status === statusType ? 'text-white' : 'text-gray-600'
                    }`}>
                      {statusType}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Stats Card */}
      <View className="flex-row justify-around py-2 border-t border-b border-gray-200 bg-white mt-2">
        <View className="items-center">
          <Text className="text-lg font-bold">{activeRides.length}</Text>
          <Text className="text-xs text-gray-500">Active Rides</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">₹{earnings}</Text>
          <Text className="text-xs text-gray-500">Earnings</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">₹55</Text>
          <Text className="text-xs text-gray-500">Bonus</Text>
        </View>
      </View>

      {/* Map */}
      <View className="flex-1 mt-2">
        <MapView
          style={{ width: '100%', height: '100%' }}
          initialRegion={initialRegion}
        >
          <Marker coordinate={{ latitude: 28.4711, longitude: 77.0736 }}>
            <View className="bg-blue-500 rounded-full p-3 shadow-lg border-2 border-white">
              <Ionicons name="location" size={20} color="white" />
            </View>
          </Marker>
          <Marker coordinate={{ latitude: 28.469, longitude: 77.073 }}>
            <View className="bg-red-500 rounded-full p-3 shadow-lg border-2 border-white">
              <Ionicons name="car" size={20} color="white" />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Ride Alerts Container */}
      {showRideAlerts && (
        <View className="absolute inset-0 bg-black/20 pointer-events-box">
          {activeRides
            .filter(ride => ride.requestStatus === 'pending')
            .slice(0, MAX_VISIBLE_MODALS)
            .map((ride, index) => (
              <RideAlertModal
                key={`${ride.id}-${index}`}
                visible={true}
                onClose={() => handleRideClose(ride.id)}
                onAccept={() => handleRideAccept(ride.id)}
                ride={ride}
                index={index}
              />
            ))}
        </View>
      )}
    </View>
  );
}