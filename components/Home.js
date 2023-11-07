import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function Home() {
    const db = SQLite.openDatabase('mhikeRn.db');
    const navigation = useNavigation();
    const route = useRoute();


    const [hikeData, setHikeData] = useState([]);
    //const [deleteHike, setDeleteHike] = useState(null);

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
                    <View style={styles.hikeItem}>
                        <Text style={styles.hikeName}>{item.name}</Text>
                        <Text style={styles.hikeLocation}>{item.location}</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => navigation.navigate('InputForm', { item: item })}
                            >
                                <AntDesign name="edit" size={24} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => {
                                    // Handle delete action here
                                    console.log(`delete ${item.location}`);
                                    deleteConfirm(item.id);
                                }}
                            >
                                <AntDesign name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('InputForm')}
            >
                <AntDesign name="pluscircle" size={40} color="blue" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    hikeItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    hikeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    hikeLocation: {
        fontSize: 16,
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
});
