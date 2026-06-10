import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FC } from "react";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";

export type AnchorDirectionShape = "left" | "right";

export interface ExperiencesDateSingleInputProps {
  defaultValue: moment.Moment | null;
  onChange?: (date: moment.Moment | null) => void;
  defaultFocus?: boolean;
  fieldClassName?: string;
  onFocusChange?: (focused: boolean) => void;
  className?: string;
  anchorDirection?: AnchorDirectionShape;
}

const ExperiencesDateSingleInput: FC<ExperiencesDateSingleInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = false,
  onFocusChange,
  anchorDirection,
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
}) => {
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [startDate, setStartDate] = useState(defaultValue);

  const windowSize = useWindowSize();

  useEffect(() => {
    setStartDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  const toDate = (m: moment.Moment | null): Date | null => (m ? m.toDate() : null);
  const toMoment = (d: Date | null): moment.Moment | null => (d ? moment(d) : null);

  const handleDateChange = (date: Date | null) => {
    const m = toMoment(date);
    setStartDate(m);
    onChange && onChange(m);
    setFocusedInput(false);
    onFocusChange && onFocusChange(false);
  };

  const renderInputCheckInDate = () => {
    return (
      <div
        className={`flex-1 flex relative ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focusedInput ? "nc-hero-field-focused" : ""
        }`}
        onClick={() => {
          setFocusedInput(true);
          onFocusChange && onFocusChange(true);
        }}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="nc-icon-field" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-grow">
          <span className="block xl:text-lg font-semibold">
            {startDate ? startDate.format("DD MMM") : "Date"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {startDate ? "Date" : `Add date`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ExperiencesDateSingleInput relative flex ${className} ${
        focusedInput ? "nc-date-focusedInput" : "nc-date-not-focusedInput"
      }`}
    >
      <div className="absolute inset-0 flex opacity-0 pointer-events-none">
        <ReactDatePicker
          selected={toDate(startDate)}
          onChange={handleDateChange}
          minDate={new Date()}
          open={focusedInput}
          onClickOutside={() => {
            setFocusedInput(false);
            onFocusChange && onFocusChange(false);
          }}
          monthsShown={1}
          popperPlacement={anchorDirection === "right" ? "bottom-end" : "bottom-start"}
          popperClassName="nc-datepicker-popper"
          className="w-full"
        />
      </div>

      {renderInputCheckInDate()}
    </div>
  );
};

export default ExperiencesDateSingleInput;
