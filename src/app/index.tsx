import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ReminderTab() {
  const [isReminding, setIsReminding] = useState(false);
  const [message, setMessage] = useState("Time to drink a glass of water!");
  const [intervalMinutes, setIntervalMinutes] = useState(1);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need notifications to remind you to drink water!'
        );
      }
    }
    requestPermissions();
  }, []);

  async function scheduleReminder() {
    await Notifications.requestPermissionsAsync(); 
    await Notifications.cancelAllScheduledNotificationsAsync(); 

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hydration Alert 💧",
        body: message, 
        sound: true, 
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: intervalMinutes * 60,
        repeats: true
      },
    });

    setIsReminding(true);
    Alert.alert("Set!", `Reminding you every ${intervalMinutes} minutes.`); 
  }

  async function stopReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setIsReminding(false);
    Alert.alert("Stopped", "Reminders cancelled.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥤</Text>

      <Text style={styles.label}>Add a Custom Message</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={(text) => setMessage(text)}
      />

      <Text style={styles.label}>Set Interval (minutes)</Text>
      <TextInput
        style={styles.input}
        value={intervalMinutes.toString()}
        onChangeText={(text) => setIntervalMinutes(parseInt(text) || 1)}
        keyboardType="numeric"
      />

      <Text style={styles.status}>
        Status: {isReminding ? "Active 🟢" : "Inactive 🔴"}
      </Text>

      <Button title="Start Reminders" onPress={scheduleReminder} color="#0EA5E9" />
      <View style={{ height: 10 }} />
      <Button title="Stop Reminders" onPress={stopReminder} color="#EF4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e1f8fc' },
  emoji: { fontSize: 60, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, color: '#005b41', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#b2ebf2', padding: 10, width: '100%', borderRadius: 8, marginTop: 5, backgroundColor: '#ffffff' },
  status: { fontSize: 16, marginVertical: 20, fontWeight: 'bold', color: '#005b41', textAlign: 'center' }
});