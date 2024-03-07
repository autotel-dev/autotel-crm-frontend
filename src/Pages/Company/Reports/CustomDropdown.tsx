import React, { useEffect, useState } from "react";
import "./CustomDropdown.css"; // Import your CSS file for styling

interface PropsTypes {
  data: any;
  selectedItems: any;
  setSelectedItems: any;
}

const CustomDropdown: React.FC<PropsTypes> = ({
  data,
  selectedItems,
  setSelectedItems = () => {},

  // setValue
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (deviceId: any, name: any) => {
    const index = selectedItems.findIndex(
      (selectedItem: any) => selectedItem.name === name
    );
    if (index === -1) {
      setSelectedItems([...selectedItems, { deviceId: deviceId, name: name }]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const handleTitleClick = (group: any) => {
    const allItems = group.items.map((item: any) => ({
      deviceId: item.deviceId,
      name: item.name,
    }));
    const selected = selectedItems.some(
      (selectedItem: any) => selectedItem === group.title
    );

    if (!selected) {
      setSelectedItems([...selectedItems, ...allItems]);
    } else {
      const updatedItems = selectedItems.filter(
        (item: any) => !allItems.some((i: any) => i.name === item.name)
      );
      setSelectedItems(updatedItems);
    }
  };
  useEffect(() => {
    console.log("selectedItems", selectedItems);
  }, [selectedItems]);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchValue("");
  };

  const filteredData = data.filter((group: any) => {
    return (
      group.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      group.items.some((item: any) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  });

  return (
    <div className="custom-dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="selected-items">
          {selectedItems.map((item: any) => `${item.name}`)}
        </div>
        {/* <div className={`arrow-icon ${isDropdownOpen ? "open" : ""}`}></div> */}
      </div>
      {isDropdownOpen && (
        <div className="dropdown-options">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="search-input"
          />
          {filteredData.map((group: any) => (
            <div key={group.title} style={{ padding: "10px" }}>
              <div className="group-header">
                <input
                  type="checkbox"
                  checked={selectedItems.some(
                    (selectedItem: any) => selectedItem === group.title
                  )}
                  onChange={() => handleTitleClick(group)}
                />
                <div className="group-title">{group.title}</div>
              </div>
              {group.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`item ${
                    selectedItems.some(
                      (selectedItem: any) => selectedItem === item.name
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleItemClick(item.deviceId, item.name)}
                  style={{ padding: "10px" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.some(
                      (selectedItem: any) => selectedItem.name === item.name
                    )}
                    onChange={() => handleItemClick(item.deviceId, item.name)}
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
