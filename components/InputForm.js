import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';


const db = SQLite.openDatabase('mhikeRn.db');

db.transaction((tx) => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, length REAL, date TEXT, difficulty TEXT, equipment TEXT, description TEXT, parkingAvailable INTEGER);'
    );
});


export default function InputForm() {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [length, setLength] = useState('');

    const [equipment, setEquipment] = useState('');
    const [description, setDescription] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);

    const data = [
        { key: '1', value: 'Easy' },
        { key: '2', value: 'Medium' },
        { key: '3', value: 'Hard' },
    ];

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleCheckBoxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleConfirmation = () => {
        if (!name || !location || !length || !selectedDifficulty) {
            // Alert the user to fill in all required inputs
            alert('Please fill in all required inputs.');
        } else {
            // Continue with the database insertion
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO hikes (name, location, length, date, difficulty, equipment, description, parkingAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
                    [name, location, length, selectedDate.toString(), selectedDifficulty, equipment, description, isChecked ? 1 : 0],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            alert('Hike data saved successfully.');
                            navigation.navigate('Home'); // Assuming 'home' is the name of your home screen

                        } else {
                            alert('Hike data not saved successfully.');
                        }
                    }
                );
            });
        }
    };



    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter hike name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={location}
                onChangeText={(text) => setLocation(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter hike length"
                value={length}
                onChangeText={(text) => setLength(text)}
                keyboardType="numeric"
            />
            <View style={styles.datePicker}>
                <Button title={selectedDate.toDateString()} onPress={showDatePickerModal} />
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>
            <View style={styles.container2}>
                <Text style={styles.header}>Select Difficulty</Text>
                <View style={styles.list}>
                    <SelectList
                        setSelected={(val) => setSelectedDifficulty(val)}
                        data={data}
                        save="value"
                    />
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Equipment (optional)"
                value={equipment}
                onChangeText={(text) => setEquipment(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Parking Available:</Text>
                <CheckBox value={isChecked} onValueChange={handleCheckBoxChange} />
            </View>
            <View style={styles.buttonsContainer}>
                <Button title="Submit" onPress={toggleModal} color="#007BFF" />
                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>Review Your Input:</Text>
                        <Text>Hike Name: {name}</Text>
                        <Text>Location: {location}</Text>
                        <Text>Hike Length: {length}</Text>
                        <Text>Hike Date: {selectedDate.toDateString()}</Text>
                        <Text>Selected Difficulty: {selectedDifficulty}</Text>
                        <Text>Equipments: {equipment}</Text>
                        <Text>Description: {description}</Text>
                        <Text>Parking Availability: {isChecked ? 'Yes' : 'No'}</Text>

                        <View style={styles.modalButtonsContainer}>
                            <Button title="Cancel" onPress={toggleModal} color="red" />
                            <Button title="Confirm" onPress={handleConfirmation} color="#007BFF" />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    container2: {

    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        padding: 8,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    datePicker: {
        padding: 16,
    },
    list: {
        width: '100%',
        color: '#000000',
        fontSize: 22,
        margin: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonsContainer: {
        marginTop: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 5,
    },
    modalHeader: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});