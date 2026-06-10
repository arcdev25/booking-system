import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FC } from "react";
import { DateRage } from "data/types";
import moment from "moment";

export type FocusedInputShape = "startDate" | "endDate";

export interface StayDatesRangeInputProps {
  defaultValue: DateRage;
  defaultFocus?: FocusedInputShape | null;
  onChange?: (data: DateRage) => void;
  onFocusChange?: (focus: FocusedInputShape | null) => void;
  className?: string;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = null,
  onFocusChange,
  className = "",
}) => {
  const [stateDate, setStateDate] = useState(defaultValue);

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  const toDate = (m: moment.Moment | null): Date | null => (m ? m.toDate() : null);
  const toMoment = (d: Date | null): moment.Moment | null => (d ? moment(d) : null);

  const handleDatesChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    const newState: DateRage = {
      startDate: toMoment(start),
      endDate: toMoment(end),
    };
    setStateDate(newState);
    onChange && onChange(newState);
  };

  return (
    <div>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          When's your trip?
        </span>
      </div>
      <div
        className={`relative flex-shrink-0 flex z-10 ${className}`}
      >
        <ReactDatePicker
          selected={toDate(stateDate.startDate)}
          onChange={handleDatesChange}
          startDate={toDate(stateDate.startDate)}
          endDate={toDate(stateDate.endDate)}
          selectsRange
          inline
          minDate={new Date()}
          monthsShown={3}
          calendarClassName="nc-mobile-datepicker"
        />
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
