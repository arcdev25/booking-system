import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { DateRage } from "data/types";
import { FC } from "react";
import useWindowSize from "hooks/useWindowResize";
import moment from "moment";

export type FocusedInputShape = "startDate" | "endDate";
export type AnchorDirectionShape = "left" | "right";

export interface StayDatesRangeInputProps {
  defaultValue: DateRage;
  defaultFocus?: FocusedInputShape | null;
  onChange?: (data: DateRage) => void;
  onFocusChange?: (focus: FocusedInputShape | null) => void;
  className?: string;
  fieldClassName?: string;
  wrapClassName?: string;
  numberOfMonths?: number;
  anchorDirection?: AnchorDirectionShape;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = null,
  onFocusChange,
  fieldClassName = "[ nc-hero-field-padding--small ]",
  wrapClassName = "divide-y divide-neutral-200 dark:divide-neutral-700 lg:divide-y-0 md:border-l md:border-r border-neutral-200 dark:border-neutral-700 lg:border-none",
  numberOfMonths,
  anchorDirection,
  className = "",
}) => {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(defaultFocus);
  const [stateDate, setStateDate] = useState(defaultValue);
  const windowSize = useWindowSize();

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  useEffect(() => {
    if (onChange) {
      onChange(stateDate);
    }
  }, [stateDate]);

  const toDate = (m: moment.Moment | null): Date | null =>
    m ? m.toDate() : null;

  const toMoment = (d: Date | null): moment.Moment | null =>
    d ? moment(d) : null;

  const handleStartDateChange = (date: Date | null) => {
    const newState: DateRage = { ...stateDate, startDate: toMoment(date) };
    setStateDate(newState);
    if (date) {
      setFocusedInput("endDate");
      onFocusChange && onFocusChange("endDate");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    const newState: DateRage = { ...stateDate, endDate: toMoment(date) };
    setStateDate(newState);
    setFocusedInput(null);
    onFocusChange && onFocusChange(null);
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput === "startDate";
    return (
      <div
        className={`relative flex items-center flex-1 ${fieldClassName} space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused--2" : " "
        }`}
        onClick={() => {
          setFocusedInput("startDate");
          onFocusChange && onFocusChange("startDate");
        }}
      >
        <div className="flex-1">
          <span className="block font-semibold">
            {stateDate.startDate
              ? stateDate.startDate.format("DD MMM")
              : "Check in"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.startDate ? "Check in" : `Add date`}
          </span>
        </div>
      </div>
    );
  };

  const renderInputCheckOutDate = () => {
    const focused = focusedInput === "endDate";
    return (
      <div
        className={`relative flex items-center flex-1 ${fieldClassName} space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused--2" : " "
        }`}
        onClick={() => {
          setFocusedInput("endDate");
          onFocusChange && onFocusChange("endDate");
        }}
      >
        <div className="flex-1">
          <span className="block font-semibold">
            {stateDate.endDate
              ? stateDate.endDate.format("DD MMM")
              : "Check out"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.endDate ? "Check out" : `Add date`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`StayDatesRangeInput relative flex-shrink-0 flex z-10 ${className} ${
        !!focusedInput ? "nc-date-focusedInput" : "nc-date-not-focusedInput"
      }`}
    >
      {/* Hidden datepickers */}
      <div className="absolute inset-0 flex opacity-0 pointer-events-none">
        <ReactDatePicker
          selected={toDate(stateDate.startDate)}
          onChange={handleStartDateChange}
          selectsStart
          startDate={toDate(stateDate.startDate)}
          endDate={toDate(stateDate.endDate)}
          minDate={new Date()}
          open={focusedInput === "startDate"}
          onClickOutside={() => setFocusedInput(null)}
          monthsShown={numberOfMonths || (windowSize.width <= 1024 ? 1 : 2)}
          popperPlacement={anchorDirection === "right" ? "bottom-end" : "bottom-start"}
          popperClassName="nc-datepicker-popper"
          className="w-full"
        />
        <ReactDatePicker
          selected={toDate(stateDate.endDate)}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={toDate(stateDate.startDate)}
          endDate={toDate(stateDate.endDate)}
          minDate={toDate(stateDate.startDate) || new Date()}
          open={focusedInput === "endDate"}
          onClickOutside={() => setFocusedInput(null)}
          monthsShown={numberOfMonths || (windowSize.width <= 1024 ? 1 : 2)}
          popperPlacement={anchorDirection === "right" ? "bottom-end" : "bottom-start"}
          popperClassName="nc-datepicker-popper"
          className="w-full"
        />
      </div>

      <div className={`grid grid-cols-2 flex-1 relative  ${wrapClassName}`}>
        {renderInputCheckInDate()}
        {renderInputCheckOutDate()}
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
