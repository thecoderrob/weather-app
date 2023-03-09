import { useState, useEffect } from "react";
import { WeatherCard } from "../components/WeatherCard";
import { trpc } from "../utils/trpc";
import axios from "axios";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IWeatherData } from "../types";

function WeatherPage() {
  const [weatherData, setWeatherData] = useState<IWeatherData[] | []>([]);
  const [city, setCity] = useState("");

  const weather = trpc.weather.useQuery();
  const cityData = trpc.cityWeather.useQuery(
    {
      cityName: city,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!weather.isLoading && weather.data) {
      setWeatherData(weather.data);
    }
  }, [weather.isLoading, weather.data]);

  if (weather.error) {
    return <div>Error: {weather.error.message}</div>;
  }

  if (!weather.data) {
    return <div>Loading weather data...</div>;
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    marginBottom: "1.5rem",
    background: isDragging ? "#202b3c" : "white",
    color: isDragging ? "white" : "#202b3c",
    boxShadow: isDragging ? "0px 3px 5px #aaa" : "",
    borderRadius: "0.5rem",

    ...draggableStyle,
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(weatherData);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    setWeatherData(items);
  };

  const deleteCard = (name: string) => {
    const newWeatherData = weatherData.filter((data) => data.name != name);

    setWeatherData(newWeatherData);
  };

  const getCityWeather = async (e: any) => {
    if (e.key === "Enter") {
      const { data, error } = await cityData.refetch();

      if (error) {
        console.log(error.message);
        return;
      } else {
        // Only return unique cities
        let arr = weatherData.filter((wd) => wd.name !== data.name);
        arr = [data, ...arr];
        setWeatherData(arr);
      }

      setCity("");
    }
  };

  const getUpdatedCityWeather = async (lat: number, lon: number) => {
    const API_KEY = "8ad9d5e0f0831fa0b921a40719524b76"; //Should come from token but was put here for convenience
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
      const { data } = await axios.get(API_URL);
      const newData = weatherData.map((wd, i) => {
        if (wd.coord.lat === lat && wd.coord.lon === lon) {
          return data;
        }

        return wd;
      });

      setWeatherData(newData);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="grid-container--weather-component | container grid">
      <div className="search-wrapper | flex">
        <input
          type="text"
          className="search-field"
          placeholder="Search for cities and press Enter"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => getCityWeather(e)}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="weather">
          {(provided) => (
            <div
              className="weather"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {weatherData.map((item, i) => {
                return (
                  <Draggable key={item.name} draggableId={item.name} index={i}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <WeatherCard
                            dt={item.dt}
                            coord={item.coord}
                            name={item.name}
                            temperature={+(item.main.temp - 273.15).toFixed(1)}
                            status={item.weather[0].main}
                            status_description={item.weather[0].description}
                            icon={item.weather[0].icon}
                            key={i}
                            deleteCard={deleteCard}
                            getUpdatedCityWeather={getUpdatedCityWeather}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default WeatherPage;
