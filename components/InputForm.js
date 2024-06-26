import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import * as SQLite from 'expo-sqlite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const db = SQLite.openDatabase('mhikeRn.db');

db.transaction((tx) => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, length REAL, date TEXT, difficulty TEXT, equipment TEXT, description TEXT, parkingAvailable INTEGER);'
    );
});

export default function InputForm() {
    const navigation = useNavigation();
    const route = useRoute();
    const hikeData = route.params?.item;

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [length, setLength] = useState('');

    const [equipment, setEquipment] = useState('');
    const [description, setDescription] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);

    if (hikeData != undefined) {
        useEffect(() => {
            setName(hikeData.name);
            setLocation(hikeData.location);
            setLength(hikeData.length.toString());
            setSelectedDate(new Date(hikeData.date));
            setSelectedDifficulty(hikeData.difficulty);
            setEquipment(hikeData.equipment);
            setDescription(hikeData.description);
            setIsChecked(hikeData.parkingAvailable === 1);
        }, []);
    }

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
        setIsModalVisible(!isModalVisible);
    };

    const handleCheckBoxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleConfirmation = () => {
        if (!name || !location || !length || !selectedDifficulty) {

            alert('Please fill in all required inputs.');
        } else {
            if (hikeData == undefined) {
                db.transaction((tx) => {
                    tx.executeSql(
                        'INSERT INTO hikes (name, location, length, date, difficulty, equipment, description, parkingAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
                        [name, location, length, selectedDate.toString(), selectedDifficulty, equipment, description, isChecked ? 1 : 0],
                        (tx, results) => {
                            navigation.navigate('Home');
                            alert('Hike data saved successfully.');
                            toggleModal();
                        },
                        (tx, error) => {
                            console.log('Updation error:' + error.message);
                            toggleModal();
                        }
                    );
                });
            } else {
                db.transaction((tx) => {
                    tx.executeSql(
                        'UPDATE hikes SET name = ?, location = ?, length = ?, date = ?, difficulty = ?, equipment = ?, description = ?, parkingAvailable = ? ' +
                        'WHERE id = ?;',
                        [name, location, length, selectedDate.toString(), selectedDifficulty, equipment, description, isChecked ? 1 : 0, hikeData.id],
                        (tx, results) => {
                            alert('Hike data updated successfully.');
                            navigation.navigate('Home');
                            toggleModal();
                        },
                        (tx, error) => {
                            console.log('Updation error:' + error.message);
                            toggleModal();
                        }
                    );
                });
            }

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
                placeholder="Enter hike length (miles)"
                value={length}
                onChangeText={(text) => setLength(text)}
                keyboardType="numeric"
            />
            <View style={styles.datePicker}>
                <Button style={styles.button} title={selectedDate.toDateString()} onPress={showDatePickerModal} />
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
                        placeholder={selectedDifficulty}
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
                <Text style={styles.label}>Parking Available</Text>
                <CheckBox value={isChecked} onValueChange={handleCheckBoxChange} />
            </View>
            <View style={styles.buttonsContainer}>
                <Button title={hikeData != undefined ? 'UPDATE' : 'SUBMIT'} onPress={toggleModal} style={styles.button} />
                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>Hike Details</Text>
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
        backgroundColor: "white"
    },
    container2: {
        padding: 16,

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
        marginRight: 5,
    },
    datePicker: {
        padding: 16,

    },
    list: {
        width: '100%',
        color: '#000000',
        fontSize: 22,
        margin: 2,
    },
    header: {
        fontSize: 20,
        marginBottom: 3,
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
    button: {
        backgroundColor: "#588157",

        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,


    },
});
