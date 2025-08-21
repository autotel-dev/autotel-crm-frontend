import { useState } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface SchedulingModalProps {
  isVisible: any;
  setIsVisible: any;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [events, setEvents] = useState<any[]>([]);

  // When user selects a time slot
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const newEvent = {
      title: "Scheduled",
      start: slotInfo.start,
      end: slotInfo.end,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleSave = () => {
    console.log("Saved events:", events);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setEvents([]); // reset or keep as per your need
    setIsVisible(false);
  };

  return (
    <Modal
      isOpen={isVisible}
      toggle={() => setIsVisible(false)}
      size="lg"
      centered
    >
      <div className="modal-header">
        <h4 className="modal-title">Create Schedule</h4>
        <button className="btn-close" onClick={() => setIsVisible(false)} />
      </div>

      <ModalBody>
        <div style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            selectable
            defaultView="week"
            views={["week"]}
            step={60}
            timeslots={4} // 4-hour spans
            style={{ height: "100%" }}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={() => ({
              style: { backgroundColor: "#4a90e2", color: "white" },
            })}
          />
        </div>

        <div className="d-flex justify-content-end mt-3">
          <Button color="primary" className="me-2" onClick={handleSave}>
            Save
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SchedulingModal;
