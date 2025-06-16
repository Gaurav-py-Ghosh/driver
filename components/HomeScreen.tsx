import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import RideAlertModal from './RideAlertModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

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

export default function HomeScreen({ navigation }: Props) {
  const [status, setStatus] = useState<'Offline' | 'Online' | 'GoHome'>('Offline');
  const [showAlert, setShowAlert] = useState(false);

  // Animation logic
  const statusIndex = { Offline: 0, Online: 1, GoHome: 2 };
  const colorProgress = useSharedValue(statusIndex[status]);

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
        backgroundColor: isActive ? bgColor : 'rgba(0,0,0,0.08)',
        shadowOpacity: isActive ? 0.25 : 0,
        transform: [{ scale: isActive ? 1.05 : 1 }],
      };
    });
  };

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
      <View className="mt-4 mx-4">
        <View className="flex-row justify-between bg-gray-200 rounded-2xl p-1.5 shadow-sm">
          <Animated.View style={[{ flex: 1, marginRight: 4, borderRadius: 12 }, getAnimatedStyle('Offline')]}> 
            <TouchableOpacity
              className="flex-1 items-center py-3 px-4 rounded-xl"
              onPress={() => setStatus('Offline')}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center space-x-2">
                <Ionicons name="power" size={18} color={status === 'Offline' ? 'white' : '#666'} />
                <Text className={`font-bold ${status === 'Offline' ? 'text-white' : 'text-gray-600'}`}>Offline</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ flex: 1, marginHorizontal: 2, borderRadius: 12 }, getAnimatedStyle('Online')]}> 
            <TouchableOpacity
              className="flex-1 items-center py-3 px-4 rounded-xl"
              onPress={() => setStatus('Online')}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center space-x-2">
                <Ionicons name="radio" size={18} color={status === 'Online' ? 'white' : '#666'} />
                <Text className={`font-bold ${status === 'Online' ? 'text-white' : 'text-gray-600'}`}>Online</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ flex: 1, marginLeft: 4, borderRadius: 12 }, getAnimatedStyle('GoHome')]}> 
            <TouchableOpacity
              className="flex-1 items-center py-3 px-4 rounded-xl"
              onPress={() => setStatus('GoHome')}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center space-x-2">
                <Ionicons name="home" size={18} color={status === 'GoHome' ? 'white' : '#666'} />
                <Text className={`font-bold ${status === 'GoHome' ? 'text-white' : 'text-gray-600'}`}>Home</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      {/* Stats Card */}
      <View className="flex-row justify-around py-2 border-t border-b border-gray-200 bg-white mt-2">
        <View className="items-center">
          <Text className="text-lg font-bold">2</Text>
          <Text className="text-xs text-gray-500">Rides</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">₹33</Text>
          <Text className="text-xs text-gray-500">Earnings</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">₹55</Text>
          <Text className="text-xs text-gray-500">Bonus</Text>
        </View>
      </View>
      {/* Map View */}
      <View className="flex-1 mt-2 rounded-2xl overflow-hidden mx-2">
        <MapView
          style={{ width: '100%', height: '100%' }}
          className="flex-1"
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
        <TouchableOpacity className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow" onPress={() => setShowAlert(true)}>
          <Text className="text-indigo-900 font-bold">Services</Text>
        </TouchableOpacity>
      </View>
      {/* Ride Alert Modal */}
      <RideAlertModal visible={showAlert} onClose={() => setShowAlert(false)} />
    </View>
  );
}