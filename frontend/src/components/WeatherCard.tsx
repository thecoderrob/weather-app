import { IWeatherCardProps } from "../types";
import { FaTrashAlt, FaUndo } from "react-icons/fa";

export const WeatherCard = ({
  name,
  dt,
  temperature,
  icon,
  status,
  status_description,
  coord,
  deleteCard,
  getUpdatedCityWeather,
}: IWeatherCardProps) => {
  const getDate = (seconds: number) => {
    const monthsInWords = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(seconds * 1000);

    const month = monthsInWords[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const getTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="weather-card">
      <div className="weather-card-content">
        <div className="weather-card-header | flex">
          <div className="temp | flow">
            <h2 className="fs-800 fw-medium">{name}</h2>
            <p className="fs-900 fw-bold">{temperature} &deg;</p>
            <p>{getDate(dt)}</p>
          </div>
          <div className="status | grid">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt=""
            />
            <div>
              <p className="fs-700 fw-medium">{status}</p>
              <p className="capitalize">{status_description}</p>
            </div>
          </div>
        </div>
        <div className="weather-card-footer | flex">
          <p className="fs-300">
            Last Updated: <br />
            {getTime(dt)}
          </p>
          <div>
            <button className="btn btn-delete" onClick={() => deleteCard(name)}>
              <FaTrashAlt />
            </button>
            <button
              className="btn btn-refresh"
              onClick={() => getUpdatedCityWeather(coord.lat, coord.lon)}
            >
              <FaUndo />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
