import React, { useState } from "react";
import { Text } from "react-native";
import { Colors } from "../../constants/Colors";

const AdjustText = ({
  children,
  initFontSize,
  numberOfLines = 1,
  screenType,
  inValid,
}) => {
  const [currentFontSize, setCurrentFontSize] = useState(initFontSize);

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    if (lines.length > numberOfLines) {
      setCurrentFontSize(currentFontSize - 0.5);
    }
  };

  return (
    <Text
      style={[
        {
          fontSize: currentFontSize,
          fontWeight: "bold",
        },
        screenType == "income"
          ? { color: "rgba(58,197,105,1)" }
          : { color: "rgba(255,119,97,1)" },
        inValid == false && { backgroundColor: "#f7aa97" },
      ]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit
      onTextLayout={onTextLayout}
    >
      {children}
    </Text>
  );
};

export default AdjustText;
