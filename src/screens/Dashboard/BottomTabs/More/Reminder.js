import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider, Text } from 'react-native-paper';
import { PostApiData, ShortToast, colors, fontFamily } from '../../../../colorSchemes/ColorSchemes';
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';

const App = () => {
  const [alarms, setAlarms] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTimeToAdd, setNewTimeToAdd] = useState(new Date());
  const [currentAlarmIndex, setCurrentAlarmIndex] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [alarmDetails, setAlarmDetails] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'Daily',
    times: [],
    days: [],
  });

  useEffect(() => {
    getAlarms()
  }, [])

  const getAlarms = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    formdata.append('user_id', JSON.parse(temp))
    const result = await PostApiData('get_medicine_alarm', formdata)
    if (result?.status == '200') {
      setAlarms(result)
    }
    else {
      ShortToast(result?.message)
    }
  }

  const openModal = (alarm, index) => {
    setIsEdit(!!alarm);
    setCurrentAlarmIndex(index);
    setAlarmDetails(alarm || {
      medicineName: '',
      dosage: '',
      frequency: 'Daily',
      times: [],
      days: [],
    });
    setModalVisible(true);
  };

  const handleFrequencyChange = (frequency) => {
    setAlarmDetails({ ...alarmDetails, frequency, times: [], days: [] });
  };

  const handleTimeChange = (event, selectedTime) => {
    //setShowTimePicker(false);
    //const newTime = selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    //setAlarmDetails({ ...alarmDetails, times: [...alarmDetails?.times, newTime] });
    setNewTimeToAdd(selectedTime)
  };

  const handleDayToggle = (day) => {
    setAlarmDetails((prevState) => ({
      ...prevState,
      days: prevState.days.includes(day)
        ? prevState.days.filter(d => d !== day)
        : [...prevState.days, day],
    }));
  };

  const handleSave = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    formdata.append("id", `${new Date().getTime()}`);
    formdata.append("frequency", alarmDetails?.frequency == 'daily' ? 'Daily' : 'Weekly');
    formdata.append("isActive", "true");
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("medicine_name", alarmDetails?.medicineName);
    formdata.append("quantity", alarmDetails?.dosage);
    formdata.append("timezone", "Asia/Kolkata");
    formdata.append("period_time", alarmDetails?.times?.join());
    formdata.append("Weekly", alarmDetails?.days?.join());
    formdata.append("alert", "true");
    const result = await PostApiData('add_medicine_alarm', formdata)
    if (result?.status == '200') {
      getAlarms()
      setModalVisible(false);
    }
  };

  const handleDelete = () => {
    const updatedAlarms = alarms.filter((_, index) => index !== currentAlarmIndex);
    setAlarms(updatedAlarms);
    setModalVisible(false);
  };

  const onPressPlusButton = () => {
    const newTime = newTimeToAdd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAlarmDetails({ ...alarmDetails, times: [...alarmDetails?.times, newTime] });
  }

  const renderAlarmItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.section1}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.medicineName}>{item?.medication}</Text>
          <Text> - </Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
        </View>
        <Text style={styles.frequency}>{item.frequency}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {item.period_list && item.period_list.map((time, i) => (
            item?.period_list?.length - 1 == i
              ?
              <Text key={i + 'a'} style={styles.time}>{time} </Text>
              :
              <Text key={i + 'b'} style={styles.time}>{time}, </Text>
          ))}
          {
            item.days?.length !== 0
            &&
            <Text>(</Text>
          }

          {item.days && item.days.map((day, i) => (
            item?.days?.length - 1 == i
              ?
              <Text key={i + 'c'} style={styles.day}>{day}</Text>
              :
              <Text key={i + 'd'} style={styles.day}>{day}, </Text>
          ))}
          {
            item.days?.length !== 0
            &&
            <Text>)</Text>
          }
        </View>
      </View>
      <Divider style={{ backgroundColor: '#fff' }} />
      <View style={styles.section2}>
        <TouchableOpacity
          style={[styles.icon, { backgroundColor: colors.MEDAL_GOLD }]}>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.icon, { backgroundColor: colors.GREEN }]}>
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.icon, { backgroundColor: colors.DARK_GRAY2 }]}
          onPress={() => openModal(item, index)}>
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <>
      <HeaderForSubmissionScreens Title="Medication" />
      <View style={styles.container}>
        <FlatList
          data={alarms?.Alarms}
          renderItem={renderAlarmItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => openModal(null)}>
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Medicine Name"
                value={alarmDetails?.medicineName}
                onChangeText={(text) => setAlarmDetails({ ...alarmDetails, medicineName: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Dosage"
                value={alarmDetails?.dosage}
                onChangeText={(text) => setAlarmDetails({ ...alarmDetails, dosage: text })}
                style={styles.input}
              />
              <Text style={styles.heading}>Select Frequency:</Text>
              <View style={styles.frequencyContainer}>
                <TouchableOpacity
                  style={[styles.frequencyButton, alarmDetails?.frequency === 'Daily' && styles.activeFrequencyButton]}
                  onPress={() => handleFrequencyChange('Daily')}>
                  <Text style={[styles.frequencyButtonText, alarmDetails?.frequency === 'Daily' && styles.activeFrequencyButtonText]}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.frequencyButton, alarmDetails?.frequency === 'Weekly' && styles.activeFrequencyButton]}
                  onPress={() => handleFrequencyChange('Weekly')}>
                  <Text style={[styles.frequencyButtonText, alarmDetails?.frequency === 'Weekly' && styles.activeFrequencyButtonText]}>Weekly</Text>
                </TouchableOpacity>
              </View>

              {alarmDetails?.frequency === 'Daily' && (
                <View>
                  <View style={styles.addTimeContainerDaily}>
                    <Text style={styles.heading}>Select up to 4 times:</Text>
                  </View>

                  {alarmDetails?.times.map((time, index) => (
                    <View key={index} style={styles.timeContainer}>
                      <Text style={styles.time}>{time}</Text>
                      <TouchableOpacity onPress={() => setAlarmDetails({
                        ...alarmDetails,
                        times: alarmDetails?.times.filter((_, i) => i !== index),
                      })}>
                        <Icon name="close" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}

                </View>
              )}

              {alarmDetails?.frequency === 'Weekly' && (
                <View>
                  <Text style={styles.heading}>Select days:</Text>
                  <View style={styles.daysContainer}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <TouchableOpacity
                        style={[styles.dayButton, alarmDetails?.days?.includes(day) && styles.activeDayButton]}
                        key={day} onPress={() => handleDayToggle(day)}>
                        <Text style={[styles.dayButtonText, alarmDetails?.days?.includes(day) && styles.activeDayButtonText]}>{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.heading}>Select time:</Text>
                  {alarmDetails?.times?.length > 0 && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.time}>{alarmDetails?.times[0]}</Text>
                      <TouchableOpacity onPress={() => setAlarmDetails({ ...alarmDetails, times: [] })}>
                        <Icon name="close" size={20} color="red" />
                      </TouchableOpacity>
                    </View>

                  )}
                </View>
              )}

              {(showTimePicker && alarmDetails?.times?.length < 4 && alarmDetails?.frequency === 'Daily') ||
                (showTimePicker && alarmDetails?.times?.length < 1 && alarmDetails?.frequency === 'Weekly') ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                  <DateTimePicker
                    style={styles.timePicker}
                    value={newTimeToAdd}
                    mode="time"
                    minuteInterval={15}
                    onChange={(a, t) => handleTimeChange(a, t)}
                  />
                  {((alarmDetails?.frequency === 'Daily' && alarmDetails?.times.length < 4) ||
                    (alarmDetails?.frequency === 'Weekly' && alarmDetails?.times.length < 1)) && (
                      <TouchableOpacity
                        onPress={onPressPlusButton}
                        style={styles.plusButton}>
                        <Icon name="plus" size={24} color="#000" />
                      </TouchableOpacity>
                    )}

                </View>
              ) : null}


              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
                {isEdit ? (
                  <Button title="Delete" color="red" onPress={handleDelete} />
                ) : (
                  <Button title="Cancel" onPress={() => setModalVisible(false)} />
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 2,
  },
  section1: {
    paddingVertical: 10,
    padding: 16,
    margin: 3,
    backgroundColor: colors.LIGHT_GREEN,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  section2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    margin: 3,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dosage: {
    fontSize: 14,
    color: colors.DARK_GRAY2
  },
  frequency: {
    fontSize: 14,
    color: colors.DARK_GRAY2,
    marginVertical: 5,
  },
  time: {
    fontSize: 16,
  },
  day: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.GREEN,
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    ...fontFamily.bold
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  frequencyButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    width: 120,
    marginVertical: 5,
    backgroundColor: '#fff'
  },
  activeFrequencyButton: {
    backgroundColor: colors.GREEN,
    borderColor: colors.GREEN,
    borderRadius: 10,

  },
  frequencyButtonText:
  {
    color: '#000'
  },
  activeFrequencyButtonText: {
    color: '#fff'
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addTimeButton: {
    color: colors.GREEN,
    textAlign: 'center',
    alignSelf: 'flex-end'
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 4,
  },
  dayButtonText: {
    color: '#000'
  },
  activeDayButton: {
    backgroundColor: colors.GREEN,
    borderColor: colors.GREEN,
  },
  activeDayButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  icon:
  {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 100
  },
  heading:
  {
    ...fontFamily.bold,
    marginVertical: 5,
  },
  timePicker:
  {
    alignSelf: 'flex-start',
    marginVertical: 10,
    marginLeft: -10,
  },
  addTimeContainerDaily:
  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  plusButton:
  {
    backgroundColor: colors.GREEN,
    padding: 5,
    borderRadius: 100,
    marginLeft: 7
  }

});

export default App;

