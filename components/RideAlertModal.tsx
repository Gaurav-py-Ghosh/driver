// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Animated, { 
//   useAnimatedStyle, 
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import { rideService, type Ride } from '../api/rideService';

// interface RideAlertModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onAccept: () => void;
//   ride: Ride;
//   index: number;
// }

// const SCREEN_HEIGHT = Dimensions.get('window').height;
// const MAX_VISIBLE_MODALS = 3;
// const MODAL_OFFSET = 60;

// export default function RideAlertModal({ visible, onClose, onAccept, ride, index }: RideAlertModalProps) {
//   const [timeLeft, setTimeLeft] = useState(ride.expiresIn);
  
//   const translateY = useAnimatedStyle(() => ({
//     transform: [{ 
//       translateY: withSpring(
//         visible ? Math.min(index, MAX_VISIBLE_MODALS - 1) * MODAL_OFFSET : SCREEN_HEIGHT,
//         { damping: 20, stiffness: 200 }
//       )
//     }],
//     zIndex: MAX_VISIBLE_MODALS - index,
//     opacity: withTiming(visible ? 1 : 0, { duration: 200 })
//   }));

//   useEffect(() => {
//     if (!visible) return;
    
//     let timer: NodeJS.Timeout;
//     const startTimer = () => {
//       timer = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             onClose();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     };

//     startTimer();
//     return () => {
//       if (timer) {
//         clearInterval(timer);
//       }
//     };
//   }, [visible, onClose]);

//   const handleAccept = useCallback(() => {
//     onAccept();
//     onClose();
//   }, [onAccept, onClose]);

//   if (!visible || index >= MAX_VISIBLE_MODALS) return null;

//   return (
//     <Animated.View 
//       style={[translateY]} 
//       className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl"
//     >
//       <View className="p-4">
//         <View className="flex-row justify-between items-center mb-4">
//           <View>
//             <Text className="text-2xl font-bold">₹{ride.baseFare}</Text>
//             <Text className="text-gray-500">Base Fare</Text>
//           </View>
//           <View className="bg-red-100 px-3 py-1 rounded-full">
//             <Text className="text-red-600 font-semibold">{timeLeft}s</Text>
//           </View>
//         </View>

//         <View className="space-y-4 mb-4">
//           <View className="flex-row items-center space-x-3">
//             <View className="bg-blue-100 p-2 rounded-full">
//               <Ionicons name="location" size={20} color="#3b82f6" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-500 text-sm">Pickup</Text>
//               <Text className="font-medium" numberOfLines={1}>{ride.pickupLocation}</Text>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-3">
//             <View className="bg-green-100 p-2 rounded-full">
//               <Ionicons name="flag" size={20} color="#22c55e" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-500 text-sm">Drop-off</Text>
//               <Text className="font-medium" numberOfLines={1}>{ride.dropLocation}</Text>
//             </View>
//           </View>
//         </View>

//         <View className="flex-row justify-between mb-4">
//           <View className="items-center">
//             <Text className="text-gray-500">Distance</Text>
//             <Text className="font-bold">{ride.distance}km</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-gray-500">Pickup</Text>
//             <Text className="font-bold">{ride.pickupDistance}km</Text>
//           </View>
//         </View>

//         <View className="flex-row space-x-3">
//           <TouchableOpacity 
//             onPress={onClose}
//             className="flex-1 bg-gray-100 py-3 rounded-xl"
//           >
//             <Text className="text-center font-semibold text-gray-600">Reject</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             onPress={handleAccept}
//             className="flex-1 bg-blue-500 py-3 rounded-xl"
//           >
//             <Text className="text-center font-semibold text-white">Accept</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Animated.View>
//   );
// }