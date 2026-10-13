import { useState, useEffect } from "react";
import { db } from "./src/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

console.log("Firestore ready:", db);

type Room = {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  available: boolean;
};

type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  bookedBy: string;
  slot: string;
  purpose: string;
  createdAt?: unknown;
};

type RoomCardProps = {
  room: Room;
  onSelect: (room: Room) => void;
  isSelected?: boolean;
};

const slots = ["08:00-09:00", "09:00-10:00", "14:00-15:00"];

function RoomCard({ room, onSelect, isSelected }: RoomCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.roomName}>{room.name}</Text>

      <Text style={styles.roomMeta}>Building: {room.building}</Text>
      <Text style={styles.roomMeta}>Floor: {room.floor}</Text>
      <Text style={styles.roomMeta}>Capacity: {room.capacity}</Text>
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

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <View key={booking.id} style={styles.bookingCard}>
      <Text style={styles.roomName}>{booking.roomName}</Text>
      <Text>{booking.building}</Text>
      <Text>Slot: {booking.slot}</Text>

      <Text>Purpose: {booking.purpose}</Text>
      <Text>Booked by: {booking.bookedBy}</Text>
    </View>
  );
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");

  const [availableRooms, setAvailableRooms] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [bookedBy, setBookedBy] = useState("");

  const [selectedBuilding, setSelectedBuilding] = useState("ALL");

  const availableRoomCount = rooms.filter((room) => room.available).length;

  useEffect(() => {
    const roomsRef = collection(db, "rooms");

    const unsubscribe = onSnapshot(
      roomsRef,
      (snapshot) => {
        const roomItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[];

        setRooms(roomItems);
        setLoadingRooms(false);
      },
      (error) => {
        console.error("Listen rooms failed:", error);

        setErrorMessage("Cannot load rooms.");

        setLoadingRooms(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        setBookings(bookingItems);
      },
      (error) => {
        console.error("Listen bookings failed:", error);
      },
    );

    return unsubscribe;
  }, []);

  async function handleBookRoom() {
    setMessage("");

    if (!selectedRoom) {
      setMessage("Please select a room.");
      return;
    }

    if (!selectedSlot) {
      setMessage("Please select a time slot.");
      return;
    }

    if (!purpose.trim()) {
      setMessage("Please enter purpose.");
      return;
    }

    if (!bookedBy.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        building: selectedRoom.building,
        slot: selectedSlot,
        purpose: purpose.trim(),
        bookedBy: bookedBy.trim(),
        createdAt: serverTimestamp(),
      });

      setMessage("Booking created.");

      setPurpose("");
      setBookedBy("");
      setSelectedRoom(null);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Create booking failed:", error);

      setMessage("Cannot create booking.");
    }
  }

  const displayedRooms = availableRooms
    ? rooms.filter((room) => room.available)
    : rooms;

  const visibleRooms =
    selectedBuilding === "ALL"
      ? displayedRooms
      : displayedRooms.filter(
          (displayRoom) => displayRoom.building === selectedBuilding,
        );
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>WEEK 7 · REACT NATIVE + EXPO</Text>

      <Text style={styles.title}>Room Booking</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Available Rooms: {availableRoomCount}
        </Text>

        <Pressable onPress={() => setAvailableRooms(!availableRooms)}>
          <Text style={styles.toggleButton}>
            {availableRooms ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            selectedBuilding === "ALL" && styles.activeFilter,
          ]}
          onPress={() => setSelectedBuilding("ALL")}
        >
          <Text style={styles.toggleButton}>ALL</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selectedBuilding === "Block A" && styles.activeFilter,
          ]}
          onPress={() => setSelectedBuilding("Block A")}
        >
          <Text style={styles.toggleButton}>A</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selectedBuilding === "Block B" && styles.activeFilter,
          ]}
          onPress={() => setSelectedBuilding("Block B")}
        >
          <Text style={styles.toggleButton}>B</Text>
        </Pressable>
      </View>
      {loadingRooms ? <Text>Loading rooms...</Text> : null}
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={visibleRooms}
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
        <Text style={styles.label}>Booked By</Text>

        <TextInput
          style={styles.input}
          value={bookedBy}
          onChangeText={setBookedBy}
          placeholder="Your name"
        />
        <Text style={styles.label}>Time Slot</Text>

        <View style={styles.slotRow}>
          {slots.map((slot) => (
            <Pressable
              key={slot}
              style={[
                styles.slotButton,
                selectedSlot === slot ? styles.selectedSlotButton : null,
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text>{slot}</Text>
            </Pressable>
          ))}
        </View>
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

      <View style={styles.sectionBooking}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <Text>Total Bookings: {bookings.length}</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
      />
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
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  slotButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
  },
  selectedSlotButton: {
    backgroundColor: "#cccccc",
    borderColor: "#222222",
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionBooking: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },

  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },

  activeFilter: {
    backgroundColor: "#E8F0FE",
  },
  toggleButton: {
    fontSize: 20,
    color: "#4285F4",
    fontWeight: "600",
  },
});
