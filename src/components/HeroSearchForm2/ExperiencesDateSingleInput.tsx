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
  fieldClassName = "[ nc-hero-field-padding--small ]",
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

  useEffect(() => {
    if (onChange) {
      onChange(startDate);
    }
  }, [startDate]);

  const toDate = (m: moment.Moment | null): Date | null => (m ? m.toDate() : null);
  const toMoment = (d: Date | null): moment.Moment | null => (d ? moment(d) : null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(toMoment(date));
    setFocusedInput(false);
    onFocusChange && onFocusChange(false);
  };

  const renderInputCheckInDate = () => {
    return (
      <div
        className={`flex w-full relative ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focusedInput ? "nc-hero-field-focused--2" : ""
        }`}
        onClick={() => {
          setFocusedInput(true);
          onFocusChange && onFocusChange(true);
        }}
      >
        <div className="flex-1">
          <span className="block font-semibold">
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
