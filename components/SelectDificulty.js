import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import Colors from "../constants/Colors";

export default function SelectDificulty({ onSelect }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const difficulties = [
    { id: 1, name: "Beginner", color: "#4CAF50" },
    { id: 2, name: "Intermediate", color: "#FF9800" },
    { id: 3, name: "Advanced", color: "#F44336" },
  ];

  const handleSelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    onSelect(difficulty);
  };

  return (
    <View style={styles.container}>

      <View style={styles.buttonContainer}>
        {difficulties.map((difficulty) => (
          <Pressable
            key={difficulty.id}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedDifficulty === difficulty.name
                    ? difficulty.color
                    : Colors.mainBackground,
              },
            ]}
            onPress={() => handleSelect(difficulty.name)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedDifficulty === difficulty.name
                      ? "white"
                      : difficulty.color,
                },
              ]}
            >
              {difficulty.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'darkgrey',
    // paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    // marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    // marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,

    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
