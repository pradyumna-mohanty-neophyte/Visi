import React, { useState, useEffect } from "react";

// material-ui imports
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.getDate()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      sx={isSelected ? { margin: "2px", borderRadius: "50%" } : undefined}
      badgeContent={isSelected ? "" : undefined}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant={"dot"}
      color={isSelected ? "primary" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

function DatePickerComp({ SetSelectedDate }) {
  const [calender, setCalender] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [highlightedDays, setHighlightedDays] = useState([]);

  useEffect(() => {
    async function getEventsdata() {
      const storeDetails = JSON.parse(
        localStorage.getItem("analysisStoreDetails"),
      );
      try {
        const body = {
          store_id: [`${storeDetails.store}`],
        };
        const Edata = { data: [] };
        const daysOnly = Edata.data.map((item) => {
          const eventdate = new Date(item);
          return eventdate;
        });
        setEvents(daysOnly);
      } catch (error) {
        console.log(error);
      }
    }
    getEventsdata();
  }, []);

  useEffect(() => {
    setHighlightedDays([]);
    const daysToHighlight = events
      .map((event) => {
        const today = new Date();
        if (event.getMonth() === today.getMonth()) {
          return event.getDate();
        }
        return null;
      })
      .filter((day) => day !== null);
    setHighlightedDays(daysToHighlight);
  }, [events]);

  const handleMonthChange = (date) => {
    const daysToHighlight = events
      .map((event) => {
        if (event.getMonth() === date.getMonth()) {
          return event.getDate();
        }
        return null;
      })
      .filter((day) => day !== null);

    setHighlightedDays(daysToHighlight);
  };

  const handlechange = (date) => {
    setCalender(date);
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-");
  }

  useEffect(() => {
    SetSelectedDate(formatDate(calender));
  }, [calender, SetSelectedDate]);

  function handleCalOpen() {
    const daysToHighlight = events
      .map((event) => {
        if (event.getMonth() === calender.getMonth()) {
          return event.getDate();
        }
        return null;
      })
      .filter((day) => day !== null);

    setHighlightedDays(daysToHighlight);
  }

  return (
    <div className="mt-5 md:mt-0">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          className="cursor-pointer"
          sx={{
            bgcolor: "white",
            "& .MuiInputBase-root": {
              height: "40px", // Adjust the height as needed
            },
          }}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              bgcolor: "white",
            },
            day: {
              highlightedDays,
            },
          }}
          format="dd/MM/yyyy"
          id="date-picker-inline"
          label="Date Selected"
          value={calender}
          onChange={handlechange}
          onMonthChange={handleMonthChange}
          minDate={new Date(2023, 11, 26)}
          maxDate={new Date()}
          closeOnSelect={false}
          onOpen={handleCalOpen}
        />
      </LocalizationProvider>
    </div>
  );
}

export default DatePickerComp;
