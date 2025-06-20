import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export interface FloatingRideCardProps {
  ride: {
    id: string;
    distance: string;
    pickupDistance: string;
    baseFare: number;
    pickupLocation: string;
    dropLocation: string;
    passenger: {
      name: string;
      avatar: string;
    };
  };
  timer: number;
  fare: number;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  buttonText: string;
  onReject: () => void;
  onAcceptOrBargain: () => void;
  zIndex: number;
  translateY: number;
  scale: number;
  isActive: boolean;
  onClick: () => void;
  singleCard?: boolean;
}

const FloatingRideCard: React.FC<FloatingRideCardProps> = ({
  ride,
  timer,
  fare,
  sliderValue,
  onSliderChange,
  buttonText,
  onReject,
  onAcceptOrBargain,
  zIndex,
  translateY,
  scale,
  isActive,
  onClick,
  singleCard = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClick}
      style={[
        styles.card,
        singleCard
          ? {
              position: 'relative',
              marginTop: 40,
              marginBottom: 40,
              zIndex: 1,
              transform: [{ scale: 1 }],
              opacity: 1,
              shadowOpacity: 0.18,
            }
          : {
              zIndex,
              transform: [
                { translateY },
                { scale: scale * (isActive ? 1 : 0.96) },
              ],
              opacity: isActive ? 1 : 0.7,
              shadowOpacity: isActive ? 0.18 : 0.08,
            },
      ]}
    >
      {/* Card Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onReject} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.fareText}>₹{fare}</Text>
          <Text style={styles.earnText}>You earn</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Distance Info */}
      <View style={styles.distanceRow}>
        <View style={styles.distanceCol}>
          <Text style={styles.distanceValue}>{ride.distance} km</Text>
          <Text style={styles.distanceLabel}>Ride Distance</Text>
        </View>
        <View style={styles.distanceCol}>
          <Text style={styles.distanceValue}>{ride.pickupDistance} km</Text>
          <Text style={styles.distanceLabel}>Pickup Distance</Text>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locationsSection}>
        <View style={styles.locationRow2}>
          <View style={styles.dotGreen} />
          <Text style={styles.locationType}>Pick Up</Text>
        </View>
        <Text style={styles.locationValue2}>{ride.pickupLocation}</Text>
        <View style={styles.locationRow2}>
          <View style={styles.dotRed} />
          <Text style={styles.locationType}>Drop Off</Text>
        </View>
        <Text style={styles.locationValue2}>{ride.dropLocation}</Text>
      </View>

      {/* Change Fare Price Section */}
      <View style={styles.fareSection}>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Change Fare Price</Text>
          <View style={styles.fareBadge}><Text style={styles.fareBadgeText}>₹{fare}</Text></View>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={ride.baseFare * 0.8}
          maximumValue={ride.baseFare * 1.2}
          step={1}
          value={sliderValue}
          onValueChange={onSliderChange}
          minimumTrackTintColor="#1e3a8a"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#1e3a8a"
        />
        <View style={styles.sliderLabelsRow}>
          <Text style={styles.sliderLabel}>-20%</Text>
          <Text style={styles.sliderLabel}>-10%</Text>
          <Text style={styles.sliderLabel}>0%</Text>
          <Text style={styles.sliderLabel}>+10%</Text>
          <Text style={styles.sliderLabel}>+20%</Text>
        </View>
      </View>

      <Text style={styles.finalFareText}>Final Fare: <Text style={{ color: '#1e3a8a' }}>₹{fare}</Text></Text>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={onAcceptOrBargain}>
          <Text style={styles.acceptButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Timer and Avatar */}
      <View style={styles.timerRow}>
        <Text style={styles.expiryText}>Expires in: {timer}s</Text>
        <Image
          source={require('../assets/icon.png')}
          style={styles.avatar}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width * 0.92,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  fareText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  earnText: {
    fontSize: 14,
    color: '#888',
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  distanceCol: {
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#888',
  },
  locationsSection: {
    marginBottom: 10,
    marginTop: 2,
  },
  locationRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  locationType: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  locationValue2: {
    fontSize: 14,
    color: '#222',
    marginLeft: 14,
    marginBottom: 2,
  },
  fareSection: {
    marginBottom: 10,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  fareBadge: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  fareBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 2,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#888',
  },
  finalFareText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 6,
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderColor: '#FF3B30',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
    flex: 1,
    marginRight: 8,
  },
  rejectButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
    flex: 1,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  expiryText: {
    color: '#FF3B30',
    fontSize: 13,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default React.memo(FloatingRideCard); 