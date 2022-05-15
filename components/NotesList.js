import {
          StyleSheet,
          Text,
          TextInput,
          TouchableWithoutFeedback,
          View,
          Keyboard,
          TouchableOpacity,
          Dimensions,
          TouchableHighlight,
          Image
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import { v4 as uuidv4 } from 'uuid';
import { getValue, setValue, removeValue } from './AsyncStorage'
import DraggableFlatList, {ScaleDecorator} from "react-native-draggable-flatlist";


const NotesList = () => {

    useEffect(()=>{
      getValue('Notes')
        .then(result =>
          setNotes(result == null ? [] : result)
          
        )
    }, [])
  
    useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getValue('Notes')
        .then(result =>
          setNotes(result == null ? [] : result)
        )
    });
    return unsubscribe;
  },[navigation])

    const navigation = useNavigation()

    const [notes, setNotes] = useState([
        { key:uuidv4(), name: 'Описание ходьбы при беге', description:''},
    ])

    const [visibleNew, setVisibleNew] = useState(false);

    const [name, setName] = useState('');


    const onChangeName = (text) => {
            setName(text)
    }

    const handleConfirmNew = () => {
        Keyboard.dismiss()
        setVisibleNew(false);
        let a = []
        notes.forEach(item=>a.push(item))
        a.push({ key:uuidv4(), name: name, description:''})
        setNotes(a)
        setValue(a, 'Notes')
        };

    const handleCancelNew = () => {
        Keyboard.dismiss()
        setVisibleNew(false);
    };


  const addNote = () => {
    setVisibleNew(true)
  }
    
    
    const onDragEnd = ({ data }) => {
        setNotes(data)
        setValue(data, 'Notes')
    }


    const renderItem = ({ item, drag, isActive }) => (
        <ScaleDecorator>
            <TouchableHighlight onPress={()=>navigation.navigate('Note', {note:item, notes:notes})} onLongPress={drag} disabled={isActive}>
                <View style={styles.deskcontainer}>
                    <Icon name='info' size={20} color="#a4aab6" />
                    <TextInput
                        placeholder='Без названия'
                        placeholderTextColor="#525358"
                        style={styles.name}
                        onChangeText={(text) => {
                          item.name = text
                          setValue(notes, 'Notes')
                        }}
                      >
                        {item.name}
                    </TextInput>
                    <Icon name='arrowup' size={20} color="#a4aab6" style={{marginStart:20}} />
                    <Icon name='arrowdown' size={20} color="#a4aab6"/>
                </View>
            </TouchableHighlight>
        </ScaleDecorator>
  )


  return (
     <View style={styles.container}>
        <View style={styles.header}>
          <View style={{width:Dimensions.get('window').width/3}}/>
          <View>
            <Text style={styles.title}>
              DevDia
            </Text>
          </View>
          <View style={{width:Dimensions.get('window').width/3, alignItems:'flex-end', paddingHorizontal:20}}>
            <TouchableOpacity 
            onPress={addNote}
            >
              <Icon name='plus' size={35} color="white" style={{ marginBottom: 5}} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.topicContainer}>
          <Text style={styles.topic}>
            ваши заметки
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <DraggableFlatList
            style={styles.WorkSpacesList}
            data={notes}
            keyExtractor={(item) => item.key}
            onDragEnd={onDragEnd}
            renderItem={renderItem}
          />
        </TouchableWithoutFeedback>       
        <Dialog.Container visible={visibleNew}>
          <Dialog.Title>Новая заметка</Dialog.Title>
          <Dialog.Description>
            Введите название 
          </Dialog.Description>
          <Dialog.Input placeholder='название' onChangeText={onChangeName} />
          <Dialog.Button label="Подтвердить" onPress={handleConfirmNew} />
          <Dialog.Button label="Отмена" onPress={handleCancelNew} />
        </Dialog.Container>
      </View>
    
  )
}

export default NotesList


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight:'bold'
    
  },
  header: {
    flexDirection:'row',
    backgroundColor: '#2c2c2e',
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical:10
  },
  WorkSpacesList: {
      marginTop: 20,
      height:515
  },
  topic: {
    fontSize: 25,
    fontFamily: 'NanumGothic-Regular',
    color:'#a6acb8'
  },
  topicContainer: {
    marginTop: 40,
    padding:10
  },
  deskcontainer: {
  backgroundColor: '#1c1c1e',
        paddingHorizontal:10,
        paddingVertical:30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#302f33',
        borderWidth:1
    },
    image: {
        width: 70,
        height: 70,
        borderRadius:10
    },
    name: {
        marginStart:20,
        fontSize: 20,
        color: '#f2f2f2',
        padding:5,
        flex: 1,
        borderBottomWidth:1,
        borderBottomColor:'#a4aab6'
  },
  hidden: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection:'row'
    }
})