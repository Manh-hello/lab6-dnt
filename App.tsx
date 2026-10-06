import { useState } from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Room = {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
  building: string;
};

type RoomCardProps = {
  room: Room;
  onSelect: (room: Room) => void;
  isSelected?: boolean;
};

const rooms: Room[] = [
  {
    id: "a201",
    name: "A201",
    capacity: 30,
    available: true,
    building: "Block A",
  },
  {
    id: "a202",
    name: "A202",
    capacity: 50,
    available: true,
    building: "Block A",
  },
  {
    id: "a203",
    name: "A203",
    capacity: 25,
    available: true,
    building: "Block A",
  },
  {
    id: "b101",
    name: "B101",
    capacity: 40,
    available: true,
    building: "Block B",
  },
  {
    id: "b202",
    name: "B202",
    capacity: 60,
    available: false,
    building: "Block B",
  },
];

function RoomCard({ room, onSelect, isSelected }: RoomCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.roomName}>{room.name}</Text>

      <Text style={styles.roomMeta}>Capacity: {room.capacity}</Text>

      <Text style={styles.roomMeta}>Building: {room.building}</Text>
      <Text style={styles.roomMeta}>
        {room.available ? "Available" : "Unavailable"}
      </Text>

      <Pressable
        style={room.available ? styles.selectButton : styles.disabledButton}
        disabled={!room.available}
        onPress={() => onSelect(room)}
      >
        <Text style={styles.selectButtonText}>
          {isSelected ? "Selected" : "Select"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");

  const [availableRooms, setAvailableRooms] = useState(false);

  function handleBookRoom() {
    if (!selectedRoom) {
      setMessage("Please select a room.");
      return;
    }

    if (!purpose.trim()) {
      setMessage("Please enter purpose.");
      return;
    }

    setMessage(
      `Booking created - ${selectedRoom.name} - ${selectedRoom.building} - ${purpose}`,
    );

    setPurpose("");
  }
  const displayedRooms = availableRooms
    ? rooms.filter((room) => room.available)
    : rooms;
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>WEEK 6 · REACT NATIVE + EXPO</Text>

      <Text style={styles.title}>Room Booking</Text>

      <Text style={styles.sectionTitle}>
        Available Rooms{" "}
        <Pressable onPress={() => setAvailableRooms(!availableRooms)}>
          <Text style={styles.toggleButton}>
            {availableRooms ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </Text>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={displayedRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onSelect={setSelectedRoom}
            isSelected={selectedRoom?.id === item.id}
          />
        )}
      />

      <View style={styles.bookingPanel}>
        <Text style={styles.selectedText}>
          Selected: {selectedRoom ? selectedRoom.name : "None"}
        </Text>

        <Text style={styles.label}>Purpose</Text>

        <TextInput
          style={styles.input}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Booking purpose"
          returnKeyType="done"
        />

        <Pressable style={styles.bookButton} onPress={handleBookRoom}>
          <Text style={styles.bookButtonText}>Book Room</Text>
        </Pressable>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 8,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  roomName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  roomMeta: {
    marginBottom: 2,
  },

  selectButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#222222",
  },

  selectButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  disabledButton: {
    display: "none",
  },

  bookingPanel: {
    paddingTop: 8,
    paddingBottom: 24,
  },

  selectedText: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },

  bookButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#222222",
  },

  bookButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  toggleButton: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 80,
    color: "#007AFF",
  },
});
