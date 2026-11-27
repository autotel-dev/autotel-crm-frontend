// Geofence list panel, floating over the map (Setup redesign).
// Replaces the dark icon strip: the same actions (new geofence, groups,
// sub-groups, collapse) are now labelled buttons in the panel header. The list,
// the create / edit form and the drawing logic stay in GeofencesTreeViewAccordian.
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GeofencesTreeViewAccordian from "../GeofencesAccordian/GeofencesTreeViewAccordian";
import { setType } from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import GroupListModal from "../modals/GroupModal/GroupListModal";
import SubGroupListModal from "../modals/SubGroupModal/SubGroupListModal";

interface PropTypes {
  isEditGeofence: boolean;
  setIsEditGeofence: any;
}

const GeofencesSidebar = ({ isEditGeofence, setIsEditGeofence }: PropTypes) => {
  const dispatch = useDispatch();
  const { geofences } = useSelector((state: any) => state.geofence);
  const [open, setOpen] = useState(true);

  const [isNewGeofence, setIsNewGeofence] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNewSubGroup, setIsNewSubGroup] = useState(false);
  const [group, setGroup] = useState("");
  const [geofenceType, setGeofenceType] = useState("");
  const [formData, setFormData] = useState({ title: "" });

  const count = (geofences || []).reduce((n: number, g: any) => n + (g?.items?.length || 0), 0);
  const editing = isNewGeofence || isEditGeofence;

  const newGeofence = () => {
    dispatch(setType(""));
    setIsNewGeofence(true);
    setGeofenceType("");
    setGroup("");
    setFormData({ ...formData, title: "" });
    setOpen(true);
  };

  return (
    <aside className={`gf-panel${open ? "" : " is-closed"}`} aria-label="Geofences">
      <div className="gf-panel__head">
        <div style={{ minWidth: 0 }}>
          <strong>{editing ? (isEditGeofence ? "Edit geofence" : "New geofence") : "Geofences"}</strong>
          {!editing && <span className="gf-muted">{count}</span>}
        </div>
        <button type="button" className="gf-icon" aria-label={open ? "Hide list" : "Show list"} title={open ? "Hide list" : "Show list"} onClick={() => setOpen(!open)}>
          {open ? "‹" : "›"}
        </button>
      </div>

      {open && !editing && (
        <div className="gf-panel__actions">
          <button type="button" className="gf-btn gf-btn--primary" onClick={newGeofence}>+ New geofence</button>
          <button type="button" className="gf-btn" onClick={() => setIsNewGroup(true)}>Groups</button>
          <button type="button" className="gf-btn" onClick={() => setIsNewSubGroup(true)}>Sub-groups</button>
        </div>
      )}
      {open && editing && (
        <p className="gf-hint">Give it a title, pick Circle, Rectangle or Polygon, then draw it on the map.</p>
      )}

      {open && (
        <div className="gf-panel__body">
          <GeofencesTreeViewAccordian
            statusDevices=""
            isNewGeofence={isNewGeofence}
            setIsNewGeofence={setIsNewGeofence}
            isEditGeofence={isEditGeofence}
            setIsEditGeofence={setIsEditGeofence}
            isNewGroup={isNewGroup}
            setIsNewGroup={setIsNewGroup}
            isNewSubGroup={isNewSubGroup}
            setIsNewSubGroup={setIsNewSubGroup}
            group={group}
            setGroup={setGroup}
            geofenceType={geofenceType}
            setGeofenceType={setGeofenceType}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      )}

      {isNewGroup && <GroupListModal isVisible={isNewGroup} setIsVisible={setIsNewGroup} />}
      {isNewSubGroup && <SubGroupListModal isVisible={isNewSubGroup} setIsVisible={setIsNewSubGroup} />}
    </aside>
  );
};

export default GeofencesSidebar;
