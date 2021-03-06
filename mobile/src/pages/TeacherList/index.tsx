import React, { useState, useEffect } from 'react';
import { View, Text , TextInput} from 'react-native';
import styles from './styles';
import PageHeader from '../../Components/PageHeader';
import TeacherItem, { Teacher } from '../../Components/TeacherItem';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');


    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response =>{
            if(response){   
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) =>{
                    return teacher.id;
                })

                setFavorites(favoritedTeachersId);
            }
        });
    }

    useFocusEffect(()=>{
        loadFavorites();
    })

    function handleToggleFiltersVisible(){
        setIsFiltersVisible(!isFiltersVisible);
    }
    async function handleFiltersSubmit(){
        loadFavorites();
        
        const response = await api.get('classes',{
            params:{
                subject,
                week_day,
                time 
            }
        });

        setTeachers(response.data);
        console.log(response.data)
    }

    return (
    <View style={styles.container}>
        <PageHeader title="Proffys disponiveis" headerRight={(
            <BorderlessButton onPress={handleToggleFiltersVisible}>
                <Feather name='filter' size={20} color='#fff'/>
            </BorderlessButton>
        )}>
            {isFiltersVisible && (
            <>
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matérias</Text>
                    <TextInput style={styles.input} value={subject} onChangeText={text=> setSubject(text)} placeholder='Qual a matérias' placeholderTextColor="#c1bcc"/>
                </View>
                <View style={styles.inputGroup}>
                    <View style={styles.inputBlock  }>
                        <Text style={styles.label}>Dia da semana</Text>
                        <TextInput style={styles.input} value={week_day} onChangeText={text=> setWeekDay(text)} placeholder='Qual o dia'/>
                    </View>
                    <View style={styles.inputBlock  }>
                        <Text style={styles.label}>Horário</Text>
                        <TextInput style={styles.input} value={time} onChangeText={text=> setTime(text)} placeholder='Qual o horário'/>
                    </View>
                   

                </View>
                <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                </RectButton>
            </>
            )}
        </PageHeader>

        <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
            paddingHorizontal:16,
            paddingBottom:16,
        }}
        
        >
            {teachers.map((teacher:Teacher) =>{
            return ( 
            <TeacherItem 
            key={teacher.id} 
            teacher={teacher}
            favorited={favorites.includes(teacher.id)}
            />
            )
                
            })}

        </ScrollView>

       

    </View>)
}

export default TeacherList;