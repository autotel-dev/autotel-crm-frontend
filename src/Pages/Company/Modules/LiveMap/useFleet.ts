// Data for the Live Monitoring page: loads the fleet once, then applies live
// socket updates in batches (same endpoints and events as the old page).
// Fixes vs. the old page:
//  - keeps the LATEST buffered update per vehicle (old code kept the first)
//  - removes only its own socket listeners on unmount (old code removed all
//    listeners for those events app-wide)
//  - reads the alerts switch through a ref, so listeners aren't re-created
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../../../Utilities/api";
import { GET_PARSER_DEVICES } from "../../../../Utilities/api/apiEndpoints";
import { setDevices } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { socketConnection } from "../../../../sockets/socket";
import Toast from "../../../../Utilities/toasts/Toast";
import { formatUnderscoredString } from "../../../../Utilities/globals/globals";

export interface LiveAlert {
  type: string;
  message: string;
  plate?: string;
  at: number;
}

const FLUSH_MS = 4000;

export const useFleet = () => {
  const dispatch = useDispatch();
  const { devices, alertsEnabled } = useSelector((state: any) => state.monitoring);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [lastAlert, setLastAlert] = useState<LiveAlert | null>(null);

  const devicesRef = useRef<any[]>(devices || []);
  devicesRef.current = devices || [];
  const alertsRef = useRef<boolean>(alertsEnabled);
  alertsRef.current = alertsEnabled;
  const bufferRef = useRef<Map<string, { latestPosition: any; vehicleStatus: any }>>(new Map());

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getAll({ url: GET_PARSER_DEVICES });
      if (res?.data) {
        // `checked` is still used by other pages that share this list.
        dispatch(setDevices(res.data.map((d: any) => ({ ...d, checked: true }))));
        setFailed(false);
      } else {
        setFailed(true);
      }
    } catch (e) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Socket listeners (shared connection — never disconnect it here)
  useEffect(() => {
    const onVehicle = (payload: any) => {
      const latestPosition = payload?.changes?.updatedFields?.latestPosition;
      if (!payload?.id || !latestPosition) return;
      bufferRef.current.set(payload.id, { latestPosition, vehicleStatus: payload.vehicleStatus });
    };
    const onAlert = (payload: any) => {
      const a = payload?.actualAlert;
      const f = payload?.formattedAlert;
      if (!a || !f) return;
      const alert: LiveAlert = {
        type: a.alertType,
        message: a.message,
        plate: f?.vehicle?.registration,
        at: Date.now(),
      };
      setLastAlert(alert);
      if (alertsRef.current) {
        Toast({
          title: formatUnderscoredString(a.alertType),
          text: a.message,
          icon: a.alertType,
          duration: 3000,
          registrationNo: alert.plate,
        });
      }
    };

    const events = ["vehicle:updated", "vehicle:created", "vehicle:deleted"];
    events.forEach((e) => socketConnection.on(e, onVehicle));
    socketConnection.on("new_alert_event", onAlert);

    const timer = setInterval(() => {
      if (bufferRef.current.size === 0) return;
      const updates = bufferRef.current;
      bufferRef.current = new Map();
      const next = devicesRef.current.map((d: any) => {
        const u = updates.get(d._id);
        return u ? { ...d, latestPosition: u.latestPosition, mainVehicleStatus: u.vehicleStatus } : d;
      });
      dispatch(setDevices(next));
    }, FLUSH_MS);

    return () => {
      events.forEach((e) => socketConnection.off(e, onVehicle));
      socketConnection.off("new_alert_event", onAlert);
      clearInterval(timer);
    };
  }, [dispatch]);

  return { devices: (devices || []) as any[], loading, failed, fetchDevices, lastAlert };
};
