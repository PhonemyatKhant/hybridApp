import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

export default function Home() {
    const db = SQLite.openDatabase('mhikeRn.db');
    const navigation = useNavigation();
    const route = useRoute();


    const [hikeData, setHikeData] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM hikes;', [], (_, { rows }) => {
                const hikeDataFromDB = rows._array;
                setHikeData(hikeDataFromDB);

            });
        });
    }, [hikeData]);
    //delete hike
    const deleteConfirm = (hikeId) => {
        Alert.alert(
            'Delete Hike',
            'Are you sure you want to delete this hike?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => deleteHike(hikeId)
                },
            ],
            { cancelable: true }
        );
    }
    const deleteAllHikes = () => {
        Alert.alert(
            'Delete Hike',
            'Are you sure you want to delete all hikes?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        db.transaction((tx) => {
                            tx.executeSql(
                                'DELETE FROM hikes;',
                                [],
                                (tx, results) => {
                                    if (results.rowsAffected > 0) {
                                        alert('All hikes deleted successfully.');
                                        // Refresh the screen or do any additional tasks
                                    } else {
                                        alert('No hikes found to delete.');
                                    }
                                }
                            )
                        })
                    }
                },
            ],
            { cancelable: true }
        );
    }
    const deleteHike = (hikeId) => {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM hikes WHERE id = ?;',
                [hikeId],
                (tx, results) => {
                    Alert.alert('Deleted', 'successfully deleted')
                },
                (tx, error) => {
                    Alert.alert('Not Deleted', 'unsuccessfull')
                });
        });
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={hikeData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Hike Details', { hike: item })}
                    >
                        <View style={styles.hikeItem}>
                            <Text style={styles.hikeName}>{item.name}</Text>
                            <Text style={styles.hikeLocation}>{item.location}</Text>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => navigation.navigate('Input Hike Details', { item: item })}
                                >
                                    <AntDesign name="edit" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => {

                                        console.log(`delete ${item.location}`);
                                        deleteConfirm(item.id);
                                    }}
                                >
                                    <AntDesign name="delete" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View></TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={() => {

                    console.log('Delete All');
                    deleteAllHikes();

                }}
            >
                <AntDesign name="delete" size={40} color="red" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Input Hike Details')}
            >
                <AntDesign name="pluscircle" size={40} color="#588157" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#DAD7CD'
    },
    hikeItem: {
        backgroundColor: '#588157',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    hikeName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "white"
    },
    hikeLocation: {
        fontSize: 16,
        color: "white"
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,

    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconButton: {
        padding: 5,
        marginLeft: 5,
    },
    deleteAllButton: {
        position: 'absolute',
        bottom: 16,
        left: 15,

    },
});
