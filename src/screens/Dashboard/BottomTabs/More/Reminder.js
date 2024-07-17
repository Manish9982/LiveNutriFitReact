import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider, FAB, Text, TextInput } from 'react-native-paper';
import { GetApiData, PostApiData, ShortToast, colors, fontFamily } from '../../../../colorSchemes/ColorSchemes';
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';

const Reminder = () => {
  const [alarms, setAlarms] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTimeToAdd, setNewTimeToAdd] = useState(new Date());
  const [currentAlarmIndex, setCurrentAlarmIndex] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [showAndroidTimePicker, setShowAndroidTimePicker] = useState(false);
  const [alarmDetails, setAlarmDetails] = useState({
    medication: '',
    dosage: '',
    frequency: 'DAILY',
    times: [],
    days: [],
  });

  useEffect(() => {
    getAlarms()
  }, [])

  useEffect(() => {
    const dateToAdd = new Date()
    dateToAdd.setMinutes(0)
    setNewTimeToAdd(dateToAdd)
  }, [])

  function formatPeriodList(input) {
    const isTimeWithDays = input.includes('(');

    function formatTime(time) {
      let [hours, minutes] = time?.match(/(\d{2}):(\d{2})/)?.slice(1, 3);
      hours = parseInt(hours, 10);
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
    }

    if (isTimeWithDays) {
      const [timePart, dayPart] = input?.match(/([\d:]+)\s*\(([^)]+)\)/)?.slice(1, 3);
      const formattedTime = formatTime(timePart);
      return `${formattedTime} (${dayPart})`;
    } else {
      const timeArray = [];
      let start = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === ',') {
          timeArray.push(input.substring(start, i));
          start = i + 1;
        }
      }
      timeArray.push(input.substring(start));
      const formattedTimes = timeArray.map(formatTime);
      return formattedTimes.join(',');
    }
  }


  const showPicker = (Platform.OS === 'ios' && showTimePicker && alarmDetails?.times?.length < 4 && alarmDetails?.frequency === 'DAILY') ||
    (Platform.OS === 'ios' && showTimePicker && alarmDetails?.times?.length < 1 && alarmDetails?.frequency === 'WEEKLY');

  const showAndroidPickerButton = (Platform.OS === 'android' && showTimePicker && alarmDetails?.times?.length < 4 && alarmDetails?.frequency === 'DAILY') ||
    (Platform.OS === 'android' && showTimePicker && alarmDetails?.times?.length < 1 && alarmDetails?.frequency === 'WEEKLY');

  const handleAndroidTimeChange = (event, selectedTime) => {
    setShowAndroidTimePicker(false);
    handleTimeChange(event, selectedTime);
  };

  const getAlarms = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    formdata.append('user_id', JSON.parse(temp))
    const result = await PostApiData('get_medicine_alarm', formdata)
    setModalVisible(false);
    console.log('result', result?.status == '200')
    if (result?.status == '200') {
      if (result?.message == "") {
        setAlarms([])
      }
      else {
        const final = JSON.parse(result?.message)
        setAlarms(final?.monitors)
      }
    }
    else {

    }
    setModalVisible(false);
  }

  const openModal = (alarm, index) => {
    setIsEdit(!!alarm);
    setCurrentAlarmIndex(index);
    if (alarm) {
      setAlarmDetails({
        ...alarm, times: alarm?.periods?.map(item => convertTo12HourFormat(item))
      })
    }
    else {
      setAlarmDetails({
        medication: '',
        dosage: '',
        frequency: 'DAILY',
        times: [],
        days: [],
      });
    }
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

  function convertTo24Hour(timeStr) {
    // Extract hours, minutes, and period (AM/PM) using regular expressions
    const timeRegex = /(\d{1,2}):(\d{2})\s*([APap][Mm])/;
    const match = timeRegex.exec(timeStr);
    if (!match) {
      throw new Error("Invalid time format");
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    // Convert hours to 24-hour format
    if (period === 'AM') {
      if (hours === 12) {
        hours = 0; // Midnight case
      }
    } else if (period === 'PM') {
      if (hours !== 12) {
        hours += 12; // Convert PM hours to 24-hour format
      }
    }
    // Format the hours to ensure two digits
    const formattedHours = hours.toString().padStart(2, '0');
    // Combine the formatted hours and minutes with a colon
    return `${formattedHours}:${minutes}`;
  }

  function convertTo12HourFormat(time) {
    // Extract the hour and minute parts from the input time string
    let hour = parseInt(time.substring(0, 2), 10);
    let minute = time.substring(2);

    // Determine AM or PM suffix
    let ampm = hour >= 12 ? 'PM' : 'AM';

    // Convert hour from 24-hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    // Format the hour to have a leading zero if necessary
    let formattedHour = hour < 10 ? '0' + hour : hour;

    // Combine the formatted hour, minute, and AM/PM suffix
    return `${formattedHour}:${minute} ${ampm}`;
  }

  const handleSave = async () => {
    if (isEdit) {
      if (((alarmDetails?.days?.length !== 0 && alarmDetails?.frequency === "WEEKLY") || alarmDetails?.frequency !== "WEEKLY") && alarmDetails?.dosage !== "" && alarmDetails?.medication !== "" && alarmDetails?.times?.length !== 0) {
        var arr = []
        arr = alarmDetails?.times?.map((item) => convertTo24Hour(item))
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData()
        if (alarmDetails?.frequency === 'DAILY') {
          formdata.append("period_time", arr?.join());
        } else {
          formdata.append("period_time", `${arr?.join()} (${alarmDetails?.days?.join()})`);
        }
        formdata.append("frequency", alarmDetails?.frequency == 'DAILY' ? 'DAILY' : 'WEEKLY');
        formdata.append("id", alarmDetails?.id);
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("medicine_name", alarmDetails?.medication);
        formdata.append("quantity", alarmDetails?.dosage);
        formdata.append("alert", "true");
        const result = await PostApiData('update_medicine_alarm', formdata)
        if (result?.status == '200') {
          getAlarms()
        }
      }
      else {
        if (alarmDetails?.times?.length == 0) {
          ShortToast("Please click on '+' button after selecting time")
        }
        else {
          ShortToast('Please fill all the fields')
        }
      }
    }
    else {
      //alarmDetails?.days?.length !== 0 is good case
      if (((alarmDetails?.days?.length !== 0 && alarmDetails?.frequency === "WEEKLY") || alarmDetails?.frequency !== "WEEKLY") && alarmDetails?.dosage !== "" && alarmDetails?.medication !== "" && alarmDetails?.times?.length !== 0) {
        var arr = []
        arr = alarmDetails?.times?.map((item) => convertTo24Hour(item))
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData()
        if (alarmDetails?.frequency === 'DAILY') {
          formdata.append("period_time", arr?.join());
        } else {
          formdata.append("period_time", `${arr?.join()} (${alarmDetails?.days?.join()})`);
        }
        formdata.append("frequency", alarmDetails?.frequency == 'DAILY' ? 'DAILY' : 'WEEKLY');
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("medicine_name", alarmDetails?.medication);
        formdata.append("quantity", alarmDetails?.dosage);
        formdata.append("alert", "true");
        const result = await PostApiData('add_medicine_alarm', formdata)
        if (result?.status == '200') {
          getAlarms()
        }
      }
      else {
        if (alarmDetails?.times?.length == 0) {
          ShortToast("Please click on '+' button after selecting time")
        }
        else {
          ShortToast('Please fill all the fields')
        }
      }
    }
  };

  const handleDelete = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("alarm_id", alarmDetails?.id);
    const result = await PostApiData('delete_medicine_alarm', formdata)
    if (result?.status == '200') {
      getAlarms()
    }
  };

  const onPressPlusButton = () => {
    const newTime = newTimeToAdd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAlarmDetails((prev) => {
      if (prev?.times?.includes(newTime)) {
        ShortToast('Time Already Exists!')
        return prev
      }
      else {
        return { ...alarmDetails, times: [...alarmDetails?.times, newTime] };
      }
    })
  }

  const acknowledgeMedicine = async (id) => {
    const result = await GetApiData(`acknowledge_medicine/${id}`)
    if (result?.status == '200') {
      getAlarms()
      ShortToast(result?.message)
    }
  }

  const toggleAlert = async (item) => {
    var arr = item?.times || item?.periodList
    if (item?.times) {
      arr?.forEach((item) => convertTo24Hour(item))
    }
    console.log("item?.timesss", item)
    console.log("arr", arr)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    if (item?.frequency === 'DAILY') {
      formdata.append("period_time", item.times ? arr?.join() : item?.periodList);
    } else {
      //formdata.append("period_time", `${item.times ? arr?.join() : item?.periodList} (${item?.days?.join()})`);
      formdata.append("period_time", `${item.times ? arr?.join() : item?.periodList}`);
    }
    formdata.append("frequency", item?.frequency == 'DAILY' ? 'DAILY' : 'WEEKLY');
    formdata.append("id", item?.id);
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("medicine_name", item?.medication);
    formdata.append("quantity", item?.dosage);
    formdata.append("alert", item?.alert ? "false" : "true");
    const result = await PostApiData('update_medicine_alarm', formdata)
    if (result?.status == '200') {
      getAlarms()
    }
  }

  const renderAlarmItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.section1}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.medication}>{item?.medication}</Text>
          <Text> - </Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
        </View>
        <Text style={styles.frequency}>{item.frequency}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* <Text>{item?.periodList}</Text> */}
          <Text>{formatPeriodList(item?.periodList)}</Text>
        </View>
      </View>
      <Divider style={{ backgroundColor: '#fff' }} />
      <View style={styles.section2}>
        <TouchableOpacity
          onPress={() => toggleAlert(item)}
          style={[styles.icon, { backgroundColor: item?.alert ? colors.MEDAL_GOLD : colors.DARK_GRAY2 }]}>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => acknowledgeMedicine(item?.id)}
          style={[styles.icon, { backgroundColor: item?.acknowledged ? colors.GREEN : colors.DARK_GRAY2 }]}>
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.icon, { backgroundColor: colors.ORANGE2 }]}
          onPress={() => openModal(item, index)}>
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <>
      <HeaderForSubmissionScreens Title="Medication Monitoring" />
      <View style={styles.container}>
        {
          alarms?.length == 0
            ?
            <View style={styles.infoContainer}>
              <Text>Click '+' button to add medications</Text>
            </View>
            :
            <FlatList
              data={alarms}
              renderItem={renderAlarmItem}
              keyExtractor={(item) => item.id.toString()}
            />
        }
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                activeUnderlineColor={colors.GREEN}
                placeholder="Medicine Name"
                value={alarmDetails?.medication}
                onChangeText={(text) => setAlarmDetails({ ...alarmDetails, medication: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Dosage"
                activeUnderlineColor={colors.GREEN}
                value={alarmDetails?.dosage}
                onChangeText={(text) => setAlarmDetails({ ...alarmDetails, dosage: text })}
                style={styles.input}
              />
              <Text style={styles.heading}>Select Frequency:</Text>
              <View style={styles.frequencyContainer}>
                <TouchableOpacity
                  style={[styles.frequencyButton, alarmDetails?.frequency === 'DAILY' && styles.activeFrequencyButton]}
                  onPress={() => handleFrequencyChange('DAILY')}>
                  <Text style={[styles.frequencyButtonText, alarmDetails?.frequency === 'DAILY' && styles.activeFrequencyButtonText]}>DAILY</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.frequencyButton, alarmDetails?.frequency === 'WEEKLY' && styles.activeFrequencyButton]}
                  onPress={() => handleFrequencyChange('WEEKLY')}>
                  <Text style={[styles.frequencyButtonText, alarmDetails?.frequency === 'WEEKLY' && styles.activeFrequencyButtonText]}>WEEKLY</Text>
                </TouchableOpacity>
              </View>

              {alarmDetails?.frequency === 'DAILY' && (
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
              {alarmDetails?.frequency === 'WEEKLY' && (
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

              <>
                {(showPicker || showAndroidPickerButton) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                    {Platform.OS === 'ios' ? (
                      <DateTimePicker
                        style={styles.timePicker}
                        value={newTimeToAdd}
                        mode="time"
                        minuteInterval={15}
                        onChange={handleTimeChange}
                      />
                    ) : (
                      <>
                        {showAndroidTimePicker && (
                          <DateTimePicker
                            value={newTimeToAdd}
                            mode="time"
                            minuteInterval={15}
                            display="default"
                            onChange={handleAndroidTimeChange}
                          />
                        )}
                        <TouchableOpacity
                          onPress={() => setShowAndroidTimePicker(true)}
                          style={styles.timePickerButton}>
                          <Text>{newTimeToAdd?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {((alarmDetails?.frequency === 'DAILY' && alarmDetails?.times.length < 4) ||
                      (alarmDetails?.frequency === 'WEEKLY' && alarmDetails?.times.length < 1)) && (
                        <TouchableOpacity
                          onPress={onPressPlusButton}
                          style={styles.plusButton}>
                          <Icon name="plus" size={24} color="#000" />
                        </TouchableOpacity>
                      )}
                  </View>
                )}
              </>


              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
                {isEdit ? (
                  <Button title="Delete" color="red" onPress={() => handleDelete()} />
                ) : (
                  <Button title="Cancel" onPress={() => setModalVisible(false)} />
                )}
              </View>
            </View>
          </View>
        </Modal>
        <FAB
          onPress={() => openModal(null)}
          icon={'plus'}
          style={styles.fab} />
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
  medication: {
    fontSize: 18,
    ...fontFamily.bold
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
    borderColor: '#ccc',
    //marginBottom: 16,
    //padding: 8,
    backgroundColor: '#fff'
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
  },
  timePickerButton:
  {
    backgroundColor: colors.DARK_GRAY,
    padding: 8,
    borderRadius: 8,
  },
  fab:
  {
    backgroundColor: colors.GREEN,
    alignSelf: 'flex-end',
  },
  infoContainer:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default Reminder;

