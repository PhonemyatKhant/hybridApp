import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function HikeDetails({ route }) {
    const hike = route.params?.hike;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{hike.name}</Text>
                <Text style={styles.subtitle}>{hike.location}</Text>
            </View>
            <Text style={styles.sectionHeader}>Details</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                    Length: {hike.length} miles
                </Text>
                <Text style={styles.detailText}>
                    Date: {hike.date}
                </Text>
                <Text style={styles.detailText}>
                    Difficulty: {hike.difficulty}
                </Text>
                <Text style={styles.detailText}>
                    Equipment: {hike.equipment}
                </Text>
                <Text style={styles.detailText}>
                    Parking Available: {hike.parkingAvailable ? 'Yes' : 'No'}
                </Text>
            </View>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.description}>{hike.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#DAD7CD',
    },
    headerContainer: {
        backgroundColor: '#588157',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 18,
        color: 'white',
        marginTop: 8,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: "#344E41"
    },
    detailsContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
