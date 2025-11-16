import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const AccordionItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);
    
    const [fontsLoaded] = useFonts({
        'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
        ...Feather.font,
    });
    
    if (!fontsLoaded) {
        return null;
    }

    const toggleExpansion = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={toggleExpansion} style={styles.header}>
                <Text style={styles.questionText}>{question}</Text>
                <Feather
                    name={expanded ? "minus" : "plus"}
                    size={24}
                    color="#18AD77"
                />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DEE2E6',
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        lineHeight: 20,
        color: '#000000',
        flexShrink: 1,
    },
    answerContainer: {
        marginTop: 8,
    },
    answerText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#343A40',
    },
});

export default AccordionItem;