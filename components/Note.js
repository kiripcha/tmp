import { StyleSheet, Text, View, Dimensions,TouchableOpacity,TextInput, TouchableWithoutFeedback, Keyboard,KeyboardAvoidingView } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {setValue} from './AsyncStorage'

const Note = ({route}) => {


    const navigation = useNavigation()

    const { note, notes } = route.params;


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.block}>
                    <TouchableOpacity onPress={() => {   
                            setValue(notes, 'Notes')                 
                            navigation.goBack(null)
                        }}>
                        <Icon 
                        name='close' 
                        size={25} 
                        color="white" 
                        style={{marginEnd:40}}
                        />
                    </TouchableOpacity>
                </View>   
                <View style={styles.block}>
                    <Text style={styles.title}>
                        Заметка
                    </Text>
                </View>
                <View style={styles.block}>                
                </View>
            </View>
            <View style={styles.cardnameContainer}>
                <TextInput
                    style={styles.cardname}
                    placeholder='Название'
                    placeholderTextColor="#525358"
                    onChangeText={(text) => {
                        note.name = text
                    }}
                >
                    {note.name}
                </TextInput>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTopic}>
                    Примечание:
                </Text>
                <TextInput
                    style={styles.description}
                    multiline={true}
                    onChangeText={(text) => note.description=text}
                >
                    {note.description}                    
                </TextInput>
            </View>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
  )
}

export default Note

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#1c1c1e'
  },
  header: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    height: 100,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection:'row'
  },
  title: {
    color: 'white',
    fontFamily: 'NanumGothic-Regular',
    fontSize:25
    
  },
  block: {
    width: Dimensions.get('window').width / 3,
    justifyContent: 'center',
    alignItems:'center'
  },
    cardnameContainer:{
        backgroundColor: '#2c2c2e',
        marginTop: 50,
        padding: 30
        
    },
    cardname:{
        fontFamily: 'NanumGothic-Regular',
        color: 'white',
        fontSize: 25
    },
    descriptionTopic: {
        color: '#747378',
        fontSize: 20,
    },
    descriptionContainer: {
        marginTop: 50,
        paddingHorizontal: 30,
        paddingVertical:15,
        backgroundColor: '#2c2c2e',
        flex:1
    },
    description: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
        flex: 1,
        
    }
})