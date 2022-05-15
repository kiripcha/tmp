import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Button
} from 'react-native'
import React, {useState, useEffect} from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { setValue, getValue } from './AsyncStorage'
import DraggableFlatList, {ScaleDecorator} from "react-native-draggable-flatlist";



const WorkSpace = ({ route }) => {

  const navigation = useNavigation()
  
  const { udesk } = route.params;

  useEffect(()=>{
      getValue(udesk.key)
        .then(result =>
          setDesks(result == null ? [] : result)
        )
    },[])
  
  const [desks, setDesks] = useState([])

  const [visibleNew, setVisible] = useState(false)


  const [cardName, setCardName] = useState('')


  const [currentDesk, setCurrentDesk] = useState('')

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getValue(udesk.key)
        .then(result =>
          setDesks(result == null ? [] : result)
        )
    });
    return unsubscribe;
  },[navigation])
  

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Card', { card: item, desks:desks, key:udesk.key })}
          onLongPress={drag}
          disabled={isActive}
        >
          <Text style={styles.cardtext} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onLongPress={() => handleDeleteCard(item)}>
            <Icon
              name='delete'
              size={20}
              color="#a6acb8"
              // style={{ alignSelf: 'center', padding: 10 }}
            />
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    )
  }


  const handleDeleteCard = (card) => {
    Alert.alert(
      "Удалить карточку",
      "Вы уверены?",
      [
         {
          text: "Отмена",
          onPress: () => console.log("Cancel Pressed")
        },
        {
          text: "Подтвердить",
          onPress: () => {
            let a = []
            // desks.filter(item => item.key != key)
            desks.forEach((item) => {
              a.push({key:item.key, name:item.name, cards:item.cards.filter(item => item.key != card.key)})
            })
            setDesks(a)
            setValue(a,udesk.key)
          }
        }
      ]
    );
  }


  const onDragEnd = ({ data }) => {
        const even = (element) => data.includes(element);
        let a = []
        desks.forEach(item=>{
          if (item.cards.some(even)) {
            a.push({ key: item.key, name: item.name, cards: data })
          } else {
            a.push(item)
          }
        })
        setDesks(a)
        setValue(a, udesk.key)
    }

  
  const addDesk = () => {
    let a = []
    desks.forEach(item=>a.push(item))
    a.push({ key: uuidv4(), name: '', cards: [] })
    setDesks([
      ...desks,
      { key: uuidv4(), name: '', cards: [] }
    ])
    setValue(a,udesk.key)
  }

  const deleteDesk = (key) => 
    Alert.alert(
      "Удалить доску",
      "Вы уверены?",
      [
         {
          text: "Отмена",
          onPress: () => console.log("Cancel Pressed")
        },
        {
          text: "Подтвердить",
          onPress: () => {
            let a = desks.filter(item => item.key != key)
            console.log(a)
            setDesks(a)
            setValue(a,udesk.key)
          }
        }
      ]
    );
  {
    
  }

  const addCard = (item) => {
    if (cardName != '') {
      item.cards.push(
      {key:uuidv4(), name:cardName, description:''}
    )
    setVisible(false)
    setCardName('')
    setValue(desks, udesk.key)
    }
  }

  return (
    <ImageBackground
      source={udesk.image}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.block}>
          <TouchableOpacity onPress={() => {
            setDesks([])
            navigation.goBack()
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
            {udesk.name}
          </Text>
        </View>
        <View style={styles.block}>
        </View>
      </View>
      <Swiper
        showsPagination={false}
        loop={false}
        bounces={true}
        onIndexChanged={(index)=>{
          setCurrentDesk(index)
          setVisible(false)
        }}
      >
        {
          [...desks, {}].map((desk, index) => {
            if (index == desks.length) {
              return (
                <View style={styles.button} key={index}>
                  <TouchableOpacity style={styles.addDesk} onPress={addDesk}>
                    <Text style={styles.textbutton}>
                      Добавить доску
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            } else {
              return (
                <View style={styles.deskContainer} key={index}>
                  <View style={styles.desk}>
                    <View style={styles.deskHeader}>
                      <TextInput
                        placeholder='Название...'
                        placeholderTextColor="#525358"
                        style={styles.input}
                        onChangeText={(text) => {
                          desk.name = text
                          setValue(desks, udesk.key)
                        }}
                      >
                        {desk.name}
                      </TextInput>
                      <TouchableOpacity onPress={() => deleteDesk(desk.key)}>
                        <Icon
                          name='closecircle'
                          size={20}
                          color="#a6acb8"
                          style={{ alignSelf: 'center', padding: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                    <DraggableFlatList
                      style={[styles.list, desk.cards.length > 5 ? { height: 275 } : { height: desk.cards.length * 55 }]}
                      data={desk.cards}
                      keyExtractor={(item) => item.key}
                      renderItem={renderItem}
                      onDragEnd={onDragEnd}
                    />
                    {
                      visibleNew && currentDesk == index ? (
                        <View style={{ padding: 5 }}>
                          <TextInput
                            placeholder='Карточка...'
                            placeholderTextColor="#525358"
                            style={{ fontSize: 15, fontFamily: 'NanumGothic-Regular', color: 'white', padding: 10, backgroundColor: '#2c2c2e', borderRadius: 5, height: 50 }}
                            onChangeText={(text) => setCardName(text)}
                          />
                          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Button
                              title='Добавить'
                              color='#275882'
                              onPress={() => addCard(desk)}
                            />
                            <Button
                              title='Отмена'
                              color='#275882'
                              onPress={() => setVisible(false)}
                            />
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.addCard} onPress={() => setVisible(true)}>
                          <Icon
                            name='plus'
                            size={10}
                            color="#525358"
                            style={{ alignSelf: 'center' }}
                          />
                          <Text style={[styles.textbutton, { color: '#525358' }]}>
                            Добавить карточку
                          </Text>
                        </TouchableOpacity>
                      )
                    }
                  </View>
                </View>
              )
            }
          })
        }
      </Swiper>
    </ImageBackground>
  )
}

export default WorkSpace

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
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
  desk: {
    backgroundColor: '#1c1c1e',
    borderRadius:10
  },
  block: {
    width: Dimensions.get('window').width / 3,
    justifyContent: 'center',
    alignItems:'center'
  },
  addDesk: {
    backgroundColor: 'rgba(28,28,30,0.5)',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbutton: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'NanumGothic-Regular',
    textAlign:'center'
  },
  button: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deskContainer: {
    flex: 1,
    paddingHorizontal: 50,
    paddingVertical: 50
  },
  deskHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:10
  },
  input: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'NanumGothic-Regular',
    flex:1
  },
  list: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal:5
  },
  addCard: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:25
  },
  card: {
    backgroundColor: '#2c2c2e',
    height:50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal:10,
    marginTop: 5,
    flexDirection:'row'
  },
  cardtext: {
    color: '#9a9a9b',
    fontSize: 17,
    fontFamily: 'NanumGothic-Regular',
    width:200
  }
})