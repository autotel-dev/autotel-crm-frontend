import React, { createContext, useContext, useState } from "react";

interface Checkpoint {
  id: string;
  type: "origin" | "waypoint" | "destination";
  checkpointName: string;
  geofenceId: string;
  geofenceName?: string;
  plannedArrival?: string;
  stayTime?: number; // Stay time at this checkpoint in minutes
  plannedDeparture?: string; // Auto-calculated: arrival + stay time
  travelTimeToNext?: number; // Travel time to next checkpoint in minutes
  overstayBuffer?: number; // Overstay buffer in minutes
}

interface TripData {
  tripName: string;
  tripType: string;
  vehicleId: string;
  driverId: string;
  notes: string;
  checkpoints: Checkpoint[];
}

interface TripContextType {
  tripData: TripData;
  setTripData: React.Dispatch<React.SetStateAction<TripData>>;
  updateTripDetails: (details: Partial<TripData>) => void;
  addCheckpoint: (checkpoint: Checkpoint) => void;
  updateCheckpoint: (id: string, updates: Partial<Checkpoint>) => void;
  removeCheckpoint: (id: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tripData, setTripData] = useState<TripData>({
    tripName: "",
    tripType: "",
    vehicleId: "",
    driverId: "",
    notes: "",
    checkpoints: [],
  });

  const updateTripDetails = (details: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...details }));
  };

  const addCheckpoint = (checkpoint: Checkpoint) => {
    setTripData((prev) => ({
      ...prev,
      checkpoints: [...prev.checkpoints, checkpoint],
    }));
  };

  const updateCheckpoint = (id: string, updates: Partial<Checkpoint>) => {
    setTripData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((cp) =>
        cp.id === id ? { ...cp, ...updates } : cp
      ),
    }));
  };

  const removeCheckpoint = (id: string) => {
    setTripData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.filter((cp) => cp.id !== id),
    }));
  };

  return (
    <TripContext.Provider
      value={{
        tripData,
        setTripData,
        updateTripDetails,
        addCheckpoint,
        updateCheckpoint,
        removeCheckpoint,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within TripProvider");
  }
  return context;
};
