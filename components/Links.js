import {
          StyleSheet,
          Text,
          View,
          Dimensions,
          TouchableHighlight,
          Linking,
          FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react'





const links = [
  { key:'1',name: 'Медитация', url:'https://youtu.be/kndqIj8Qgok'},
  { key:'2',name: 'Для занятия учебой/работой', url:'https://youtu.be/lTRiuFIWV54'},
  { key:'3',name: 'Для отдыха', url:'https://youtu.be/DWcJFNfaw9c'},
  { key:'4',name: 'Для ценителей', url:'https://youtu.be/VBiJPxroMt8'}
]



const Links = () => {

  
  const handlePress = async (url) => {
    await Linking.openURL(url);
  };

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
          </View>
        </View>
        
        <View style={styles.topicContainer}>
          <Text style={styles.topic}>
            полезные ссылки
          </Text>
        </View>
        
          <FlatList
            style={styles.WorkSpacesList}
            data={links}
            showsVerticalScrollIndicator={false}            
            renderItem={({item})=>
            (<TouchableHighlight onPress = {() => handlePress(item.url)}>
                <View style={styles.deskcontainer}>                    
                  <Text
                        style={styles.name}
                        numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Icon name='caretright' size={20} color="#a4aab6" style={{marginStart:20}} />                    
                </View>
            </TouchableHighlight>)}
          />        
      </View>
    
  )
}

export default Links


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

  