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
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Dialog from "react-native-dialog";
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { getValue, setValue, removeValue } from './AsyncStorage'



const WorkSpacesList = () => {

  useEffect(()=>{
      getValue('workSpaces')
        .then(result =>
          {setList(result == null ? [] : result)
          setDesks(result == null ? [] : result)}
        )
    },[])

  const navigation = useNavigation()

  const [listOfDesks, setList] = useState([]);

  const [searchedDesks, setDesks] = useState(listOfDesks)

  const [text, setText] = useState('')

  const [name, setName] = useState('');

  const [visibleEdit, setVisibleEdit] = useState(false);

  const [visibleNew, setVisibleNew] = useState(false);

  const [currentDesk, setDesk] = useState({})

  const handleClear = () => {
    setText('')
    setDesks(listOfDesks)
  }

  const handleChange = (text) => {
    setText(text)
    if (text != '') {
      setDesks(listOfDesks.filter(item =>
        item.name.search(text) != -1
      )
      )
    } else {
      setDesks(listOfDesks)
    }
  }

  const pickAlbumProfile = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      return result.uri
    }
  };


  const onChangeName = (text) => {
        setName(text)
  }

  const handleConfirmNew = () => {
      Keyboard.dismiss()
      setVisibleNew(false);
      let a = []
      listOfDesks.forEach(item=>a.push(item))
      a.push({ key:uuidv4(), name: name, image:null})
      setList(a)
      setText('')
      setDesks(a) 
      setValue(a, 'workSpaces')
    };

  const handleCancelNew = () => {
    Keyboard.dismiss()
    setVisibleNew(false);
  };


  const handleConfirmEdit = (item) => {
        Keyboard.dismiss()
        setVisibleEdit(false);
        let a = []
        listOfDesks.forEach(desk=>{
          desk.key!=item.key?a.push(desk):a.push({key:item.key, name:name, image:item.image})
        })
        let b = []
        searchedDesks.forEach(desk=>{
          desk.key!=item.key?b.push(desk):b.push({key:item.key, name:name, image:item.image})
        })
        setList(a)
        setDesks(b)
        setValue(a, 'workSpaces')
  };
  
  const addWorkSpace = () => {
    setVisibleNew(true)
  }

  const handleCancelEdit = () => {
        Keyboard.dismiss()
        setVisibleEdit(false);
        };

  const handleDelete = (item) => {
    let a = listOfDesks.filter(desk => desk.key != item.key)
    let b = searchedDesks.filter(desk => desk.key != item.key)
    setList(a)
    setDesks(b)
    removeValue(item.key)
    setValue(a, 'workSpaces')
  }

  const handlePicture = (item) => {
    pickAlbumProfile()
      .then(result => {
        let a = []
        listOfDesks.forEach(desk=>{
          desk.key!=item.key?a.push(desk):a.push({key:item.key, name:item.name, image:{ uri: result }})
        })
        let b = []
        searchedDesks.forEach(desk=>{
          desk.key!=item.key?b.push(desk):b.push({key:item.key, name:item.name, image:{ uri: result }})
        })
        setList(a)
        setDesks(b)
        setValue(a, 'workSpaces')
      })
  }
    
  
  const renderItem = ( data, rowMap ) => (
        <SwipeRow
          rightOpenValue={-130}
          friction={7}
          tension={90}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={true}
        >
            <View style={styles.hidden}>
                <TouchableOpacity 
                    onPress={()=>{
                      setVisibleEdit(true)
                      setDesk(data.item)
                    }}
                >
                    <Icon 
                      name='edit' 
                      size={25} 
                      color="#f2f2f2" 
                      style={{marginRight:15, alignSelf:'center', marginTop:30}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>handlePicture(data.item)}
                >
                    <Icon 
                      name='picture' 
                      size={25} 
                      color="#f2f2f2" 
                      style={{marginRight:15, alignSelf:'center', marginTop:30}}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>handleDelete(data.item)}
                >
                    <Icon 
                      name='delete' 
                      size={25} 
                      color="#f2f2f2" 
                      style={{marginRight:15, alignSelf:'center', marginTop:30}}
                    />
                </TouchableOpacity>
            </View>
            <TouchableHighlight onPress={()=>navigation.navigate('WorkSpace', {udesk:data.item})}>
                <View  style={styles.deskcontainer}>
                    <Image
                        source={data.item.image == null ? require('../assets/icon.png') : data.item.image}
                        style={styles.image}
                    />
                    <Text
                        style={styles.name}
                    >
                        {data.item.name}
                    </Text>
                </View>
            </TouchableHighlight>
        </SwipeRow>
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
            <TouchableOpacity onPress={addWorkSpace}>
              <Icon name='plus' size={35} color="white" style={{ marginBottom: 5}} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.search}>
          <Icon name='search1' size={25} color="#61697a" style={{padding:10}}/>
          <TextInput
            placeholderTextColor="#807f83" 
            placeholder='Пространство...'
            style={styles.input}
            onChangeText={handleChange}
            value={text}
          />
          <TouchableOpacity onPress={handleClear}>
            <Icon name='closecircleo' size={25} color="#61697a" style={{ padding: 10 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.topicContainer}>
          <Text style={styles.topic}>
            ваши пространства
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SwipeListView
            style={styles.WorkSpacesList}
            data={searchedDesks}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </TouchableWithoutFeedback>
        <Dialog.Container visible={visibleEdit}>
          <Dialog.Title>Новое название</Dialog.Title>
          <Dialog.Description>
              Введите имя пространства
          </Dialog.Description>
          <Dialog.Input placeholder='название' onChangeText={onChangeName} />
          <Dialog.Button label="Подтвердить" onPress={()=>handleConfirmEdit(currentDesk)} />
          <Dialog.Button label="Отмена" onPress={handleCancelEdit} />
        </Dialog.Container>
        <Dialog.Container visible={visibleNew}>
          <Dialog.Title>Новое рабочее пространство</Dialog.Title>
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

export default WorkSpacesList

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
  search: {
    backgroundColor: '#1c1c1e',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 15,
    marginHorizontal:10
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
    marginTop:20
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
  input: {
    color: 'white',
    fontSize: 15,
    flex: 1
  },
  deskcontainer: {
  backgroundColor: '#1c1c1e',
        padding: 10,
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
        color:'#f2f2f2'
  },
  hidden: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection:'row'
    }
})