import React, { useEffect, useRef, useState } from "react";
import "./CustomDropdown.css"; // Import your CSS file for styling
import { Data } from "@react-google-maps/api";

interface PropsTypes {
  data: any;
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const CustomDropdown: React.FC<PropsTypes> = ({
  data,
  selectedItems,
  setSelectedItems,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // console.log("data", data);

  const handleTitleClick = (group: any) => {
    const isGroupSelected = selectedItems.some(
      (item) => item.title === group.title
    );
    if (!isGroupSelected) {
      const newSelectedItems = [
        ...selectedItems,
        ...group.items.map((item: any) => ({
          deviceId: item.id,
          name: item.name,
          title: item.title,
        })),
      ];
      setSelectedItems(newSelectedItems);
    } else {
      const updatedItems = selectedItems.filter(
        (item) => item.title !== group.title
      );
      setSelectedItems(updatedItems);
    }
  };

  const handleItemClick = (deviceId: any, name: any, group: any) => {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem.name === name
    );
    if (index === -1) {
      setSelectedItems([
        ...selectedItems,
        { deviceId: deviceId, name, title: group.title },
      ]);
    } else {
      const updatedItems = selectedItems.filter(
        (selectedItem) => selectedItem.name !== name
      );
      setSelectedItems(updatedItems);
    }
  };
  const handleDeselectAll = () => {
    setSelectedItems([]);
  };
  const handleSelectAll = () => {
    const allItems = data.flatMap((group: any) =>
      group.items
        .filter(
          (item: any) =>
            !selectedItems.some(
              (selectedItem) => selectedItem.name === item.name
            )
        )
        .map((item: any) => ({
          deviceId: item.id,
          name: item.name,
          title: item.title,
        }))
    );
    setSelectedItems([...selectedItems, ...allItems]);
  };

  useEffect(() => {
    // console.log("selectedItems", selectedItems);
  }, [selectedItems]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      // Add type assertion here
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchValue("");
  };

  const filteredData = data
    .map((group: any) => {
      const filteredItems = group.items.filter(
        (item: any) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.imei.includes(searchValue) ||
          item.id == searchValue
      );
      return { ...group, items: filteredItems };
    })
    .filter((group: any) => group.items.length > 0);

  return (
    <div className="custom-dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="selected-items">
          {selectedItems.length === 0 && "No device selected"}
          {selectedItems.map((item: any) => `${item.name}, `)}
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
          <div style={{ display: "flex" }}>
            <button
              onClick={(e: any) => {
                e.preventDefault(); // Add this line
                handleSelectAll();
              }}
            >
              Select All
            </button>
            <button
              onClick={(e: any) => {
                e.preventDefault(); // Add this line
                handleDeselectAll();
              }}
            >
              Deselect All
            </button>
          </div>
          {filteredData.map((group: any) => (
            <div key={group.title} style={{ padding: "10px 10px 0px 10px" }}>
              <div className="group-header">
                <input
                  type="checkbox"
                  checked={group.items.every((item: any) =>
                    selectedItems.some(
                      (selectedItem) => selectedItem.name === item.name
                    )
                  )}
                  onChange={() => handleTitleClick(group)}
                />
                <div className="group-title">{group.title}</div>
              </div>
              {group.items
                .filter(
                  (bodyItem: any) =>
                    bodyItem.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    bodyItem.imei.includes(searchValue) ||
                    bodyItem.id == searchValue
                )
                .slice(0, 150)
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
                    onClick={() => handleItemClick(item.id, item.name, group)}
                    style={{ padding: "10px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.some(
                        (selectedItem) => selectedItem.name === item.name
                      )}
                      onChange={() =>
                        handleItemClick(item.id, item.name, group)
                      }
                    />
                    <span>{`${item.name}`}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
