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
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  wrapClassName = "",
  numberOfMonths,
  anchorDirection,
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

  const toDate = (m: moment.Moment | null): Date | null =>
    m ? m.toDate() : null;

  const toMoment = (d: Date | null): moment.Moment | null =>
    d ? moment(d) : null;

  const handleStartDateChange = (date: Date | null) => {
    const newState: DateRage = { ...stateDate, startDate: toMoment(date) };
    setStateDate(newState);
    onChange && onChange(newState);
    if (date) {
      setFocusedInput("endDate");
      onFocusChange && onFocusChange("endDate");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    const newState: DateRage = { ...stateDate, endDate: toMoment(date) };
    setStateDate(newState);
    onChange && onChange(newState);
    setFocusedInput(null);
    onFocusChange && onFocusChange(null);
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput === "startDate";
    return (
      <div
        className={`relative flex ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused" : " "
        }`}
        onClick={() => {
          setFocusedInput("startDate");
          onFocusChange && onFocusChange("startDate");
        }}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
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
        className={`relative flex ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused" : " "
        }`}
        onClick={() => {
          setFocusedInput("endDate");
          onFocusChange && onFocusChange("endDate");
        }}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
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
      className={`StayDatesRangeInput relative flex z-10 ${className} ${
        !!focusedInput ? "nc-date-focusedInput" : "nc-date-not-focusedInput"
      }`}
    >
      {/* Hidden datepickers that open on field focus */}
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
          monthsShown={numberOfMonths || (windowSize.width < 1024 ? 1 : 2)}
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
          monthsShown={numberOfMonths || (windowSize.width < 1024 ? 1 : 2)}
          popperPlacement={anchorDirection === "right" ? "bottom-end" : "bottom-start"}
          popperClassName="nc-datepicker-popper"
          className="w-full"
        />
      </div>

      <div className={`flex-1 grid grid-cols-2 relative ${wrapClassName}`}>
        {renderInputCheckInDate()}
        {renderInputCheckOutDate()}
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
