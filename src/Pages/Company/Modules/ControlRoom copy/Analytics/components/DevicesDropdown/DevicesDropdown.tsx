import React, { useEffect, useRef, useState } from "react";
import "./DevicesDropdown.css";

interface PropsTypes {
  data: any; // raw device list from API
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  serverID: any;
}

const DevicesDropdown: React.FC<PropsTypes> = ({
  data,
  selectedItems,
  setSelectedItems,
  serverID,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------
  // ⭐ Convert API data into dropdown-friendly structure
  // -------------------------------------------
  const modifiedData = [
    {
      title: "All Devices",
      items: data.map((item: any) => ({
        id: item._id, // dropdown uses item.id
        name: item.registrationNo, // dropdown uses item.name
        imei: item.imei,
        traccarDeviceId: item.traccarDeviceId,
        group: item.group,
        server: { _id: item.traccarDeviceId }, // dropdown expects item.server._id
      })),
    },
  ];

  // -------------------------------------------
  // Select / unselect device (single selection)
  // -------------------------------------------
  const handleItemClick = (device: any, id: any) => {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === id
    );

    if (index === -1) {
      setSelectedItems([device]); // only allow 1 device
    } else {
      const updatedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== id
      );
      setSelectedItems(updatedItems);
    }
    toggleDropdown();
  };

  // -------------------------------------------
  // Close dropdown on outside click
  // -------------------------------------------
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -------------------------------------------
  // Toggle dropdown
  // -------------------------------------------
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchValue("");
  };

  // -------------------------------------------
  // Filter devices by name, IMEI, or ID
  // -------------------------------------------
  const filterData = () => {
    return modifiedData
      .map((group: any) => {
        const filteredItems = group.items.filter(
          (item: any) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.imei.includes(searchValue) ||
            item.id === searchValue
        );
        return { ...group, items: filteredItems };
      })
      .filter((group: any) => group.items.length > 0);
  };

  return (
    <div className="custom-dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="selected-items">
          {selectedItems.length === 0 && "No device selected"}
          {selectedItems.map((item: any) => `${item.name} `)}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-options" ref={dropdownRef}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="search-input"
          />

          {filterData().map((group: any) => (
            <div key={group.title} style={{ padding: "10px 10px 0px 10px" }}>
              <div className="group-header">
                <input
                  type="checkbox"
                  checked={group.items.every((item: any) =>
                    selectedItems.some(
                      (selectedItem) => selectedItem.name === item.name
                    )
                  )}
                />
                <div className="group-title">{group.title}</div>
              </div>

              {(serverID !== ""
                ? group.items.filter((item: any) => item.server._id == serverID)
                : group.items
              )
                .slice(0, 100)
                .map((item: any) => (
                  <div
                    key={item.id}
                    className={`item ${
                      selectedItems.some(
                        (selectedItem) => selectedItem.name === item.name
                      )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleItemClick(item, item.id)}
                    style={{ padding: "10px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.some(
                        (selectedItem) => selectedItem.name === item.name
                      )}
                      onChange={() => handleItemClick(item, item.id)}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevicesDropdown;
