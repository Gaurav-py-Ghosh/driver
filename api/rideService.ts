import rides from '../data/rides.json';

export interface Ride {
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
  expiresIn: number;
  requestStatus?: 'pending' | 'accepted' | 'rejected'; // <-- add this line
}

export const rideService = {
  getRideRequest: async (id: string): Promise<Ride> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ride = rides.rides.find(r => r.id === id);
      if (!ride) {
        throw new Error('No ride available at the moment');
      }
      // Ensure requestStatus is of the correct type
      const allowedStatuses = ['pending', 'accepted', 'rejected'] as const;
      const requestStatus = allowedStatuses.includes(ride.requestStatus as typeof allowedStatuses[number])
        ? (ride.requestStatus as typeof allowedStatuses[number])
        : undefined;
      return { ...ride, requestStatus } as Ride;
    } catch (error) {
      console.warn('Ride fetch warning:', error);
      // Return a default ride instead of throwing
      return {
        id: id,
        distance: "0.0",
        pickupDistance: "0.0",
        baseFare: 0,
        pickupLocation: "Not available",
        dropLocation: "Not available",
        passenger: {
          name: "Guest",
          avatar: "../assets/icon.png"
        },
        expiresIn: 30
      };
    }
  },

  acceptRide: async (id: string, finalFare: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  rejectRide: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};