import React,{useState,useEffect} from 'react'
import {FlatList,View,Text} from 'react-native'
import { useRoute } from '@react-navigation/native';
import PropertiesCards from './PropertiesCards'


export default function FilterData() {
    const route = useRoute();
    const [propertiesData, setPropertiesData] = useState([]);
    useEffect(()=>{
        const paramsData = route.params.filterData;
        console.log('Params Data',paramsData)
        setPropertiesData(paramsData)
    },[])
    return (
        
propertiesData.length>0? <FlatList
        style={{flex:1}}
        data={propertiesData}
        renderItem = {({item})=> <PropertiesCards item={item}/>}
        
      />:<View><Text>No Item Found</Text></View>
    )
}
