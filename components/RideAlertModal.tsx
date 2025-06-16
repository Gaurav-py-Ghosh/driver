import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';

const userAvatar = require('../assets/icon.png');

interface RideAlertModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RideAlertModal({ visible, onClose }: RideAlertModalProps) {
  const [fare, setFare] = useState(78);
  const [finalFare, setFinalFare] = useState(88);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (!visible) return;
    setTimer(5);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/30">
        <View className="bg-white rounded-t-2xl p-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl">×</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-center flex-1">₹{fare}</Text>
            <View className="w-8 h-8" />
          </View>
          <View className="flex-row justify-between my-2">
            <Text className="text-base font-semibold">6.8 km</Text>
            <Text className="text-base font-semibold">1.2 km</Text>
          </View>
          <View className="my-2">
            <Text className="text-xs text-gray-500">Pick Up</Text>
            <Text className="text-sm font-semibold">Medinova Apartments, Plot no 50, Sector...</Text>
            <Text className="text-xs text-gray-500 mt-1">Drop Off</Text>
            <Text className="text-sm font-semibold">Galleria Market, DLF Phase IV, Sector 28,G...</Text>
          </View>
          <View className="flex-row items-center my-2">
            <Image source={userAvatar} className="w-8 h-8 rounded-full mr-2" />
            <Text className="text-xs text-gray-500">Change Fare Price</Text>
            <Text className="ml-auto font-bold">₹{fare}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={18}
            maximumValue={138}
            step={2}
            value={fare}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#6366f1"
            onValueChange={setFare}
            onSlidingComplete={(v) => setFinalFare(v + 10)}
          />
          <Text className="text-base font-bold text-center mt-2">Final Fare : ₹{finalFare}</Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="flex-1 bg-red-600 py-2 rounded-xl mr-2" onPress={onClose}>
              <Text className="text-white text-center font-bold">Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-xl ml-2" onPress={onClose}>
              <Text className="text-white text-center font-bold">Accept</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-red-600 text-center mt-2">Expires in: {timer}s</Text>
        </View>
      </View>
    </Modal>
  );
} 