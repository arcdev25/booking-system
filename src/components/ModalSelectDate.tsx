import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { DateRage } from "data/types";
import moment from "moment";
import React, { FC, Fragment, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import ButtonPrimary from "shared/Button/ButtonPrimary";

interface ModalSelectDateProps {
  onClose?: () => void;
  onSelectDate: (date: DateRage) => void;
  defaultValue: DateRage;
  renderChildren?: (p: {
    defaultValue: DateRage;
    openModal: () => void;
  }) => React.ReactNode;
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({
  defaultValue,
  onClose,
  onSelectDate,
  renderChildren,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [stateDate, setStateDate] = useState(defaultValue);

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const toDate = (m: moment.Moment | null): Date | null => (m ? m.toDate() : null);
  const toMoment = (d: Date | null): moment.Moment | null => (d ? moment(d) : null);

  const handleDatesChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    const newState: DateRage = {
      startDate: toMoment(start),
      endDate: toMoment(end),
    };
    setStateDate(newState);
    onSelectDate && onSelectDate(newState);
  };

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ defaultValue, openModal })
    ) : (
      <button onClick={openModal}>Select Date</button>
    );
  };

  return (
    <>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-50"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between ">
                  <>
                    <div className="absolute left-4 top-4">
                      <button
                        className="focus:outline-none focus:ring-0"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                      </button>
                    </div>

                    <div className="flex-1 pt-12 p-1 flex flex-col overflow-hidden">
                      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-neutral-800">
                        <div className="flex-1 flex flex-col transition-opacity animate-[myblur_0.4s_ease-in-out] overflow-auto">
                          <div className="p-5 ">
                            <span className="block font-semibold text-xl sm:text-2xl">
                              When's your trip?
                            </span>
                          </div>
                          <div className={`flex-1 relative flex z-10 overflow-hidden justify-center`}>
                            <ReactDatePicker
                              selected={toDate(stateDate.startDate)}
                              onChange={handleDatesChange}
                              startDate={toDate(stateDate.startDate)}
                              endDate={toDate(stateDate.endDate)}
                              selectsRange
                              inline
                              minDate={new Date()}
                              monthsShown={3}
                              calendarClassName="nc-modal-datepicker"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                      <button
                        type="button"
                        className="underline font-semibold flex-shrink-0"
                        onClick={() => {
                          const cleared: DateRage = {
                            startDate: moment(),
                            endDate: moment().add(1, "days"),
                          };
                          setStateDate(cleared);
                          onSelectDate && onSelectDate(cleared);
                        }}
                      >
                        Clear dates
                      </button>
                      <ButtonPrimary
                        sizeClass="px-6 py-3 !rounded-xl"
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        Save
                      </ButtonPrimary>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalSelectDate;
