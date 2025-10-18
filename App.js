import { StyleSheet, Text, TextInput, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

const API_KEY = 'd8112711e0538c534d6cabc91d28a6f3';

const Cell = ({ item , timezone}) => {
  const utcFecha = new Date(item.dt * 1000);       
  const fecha = new Date(utcFecha.getTime() + timezone * 1000);
  const weekday = fecha.toLocaleString('en-US', { weekday: 'long' });
  const time = fecha.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' , hour12: false, timeZone: 'UTC'});

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weekday}>{weekday}</Text>

      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
        style={styles.icon}
      />

      <View style={styles.timeDesContainer}>
        <Text style={styles.timeDes}>{item.weather[0].description}</Text>
        <Text style={styles.timeDes}>{time}</Text>
      </View>

      <Text style={styles.temp}>{item.main.temp.toFixed(0)}°C</Text>
    </View>
  );
};


const Weather = ({ city }) => {
  const[isLoading, setLoading] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [cityInfo, setCityInfo] = useState([]);
  

  const getWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
      const json = await response.json();
      setWeatherData(json.list)
      setCityInfo(json.city);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {

  const timer = setTimeout(() => {
    getWeather();
  }, 1000);

  return () => clearTimeout(timer);
}, [city]);


  return isLoading?(
    <ActivityIndicator  size = 'large' color = '#c9dded' style = {{  marginTop: 20}}/>
    ) : (
    <SafeAreaProvider>
      <SafeAreaView style={ styles.contenedor}>
        {weatherData && weatherData.length > 0 ? (
          <>
            <FlatList
              data={weatherData}
              keyExtractor={(item) => item.dt.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
              <View style={styles.current}>
                <Text style={{ ...styles.temp, fontSize: 80 }}>
                  {weatherData[0].main.temp.toFixed(0)}°C
                </Text>
                <Text style={styles.des}>
                  {weatherData[0].weather[0].description}
                </Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weatherData[0].weather[0].icon}@2x.png`,
                  }}
                  style={{ width: 60, height: 60 }}
                />
              </View>
            )}
              renderItem={({ item }) => <Cell item={item} timezone={cityInfo.timezone}/>}
            />
          </>
        ) : (
          <Text style={styles.noCity}>No results for "{city}"</Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  ) ;
}

export default function App() {
  const [city, setCity] = useState('Hermosillo');

  return (
     <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style = {{ paddingBottom: 10}}>
          <TextInput
            style={styles.input}
            placeholder='Enter a city'
            value={city}
            onChangeText={setCity}
          />
        </View>
        {city.trim() === '' ? (
          <Text style={styles.noCity}>
            Please enter a city to see the weather
          </Text>
        ):(
          <Weather city={city} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d5e9b',
    paddingTop: 10,
    paddingHorizontal: 16
  },
   contenedor: {
    flex: 1,
    padding: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#105293',
    marginVertical: 5,
    borderRadius: 15,
    paddingVertical: 13,
    backgroundColor: '#4f87bc',
    fontSize: 20,
    color: '#ffffff'
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    paddingVertical: 13,
    borderRadius: 20,
    backgroundColor: 'rgba(105, 149, 191, 0.7)',
    width: '100%',
  },
  timeDesContainer: {
    flex: 2,
    alignItems: 'flex-start'
  },
  weekday:{
    paddingLeft: 10,
    fontSize: 20,
    flex: 1.3,
    color: '#ffffff'
  },
  icon:{
    width: 35, 
    height: 35 
  },
  temp: {
    flex: 0,
    fontSize: 20,
    textAlign: 'left',
    paddingRight: 10,
    color: '#ffffff',
  },
  des:{
    fontSize: 20,
    color: '#265170',
    borderRadius: 20,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(175, 209, 234, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1
  },
  timeDes: {
    fontSize: 15,
    color: '#ffffff'
  },
  noCity: {
    marginTop : 10,
    color: '#ffffff',
    textAlign: 'center'
  },
  current: {
    marginVertical: 10, 
    alignItems: 'center', 
    width: "65%", 
    alignSelf: 'center',
  }
});
