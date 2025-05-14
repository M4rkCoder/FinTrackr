import React, { useEffect, useRef, useState } from "react";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

const DateInput = ({ value, onChange, showCalendar = false }) => {
  const [date, setDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  });

  const [isOpen, setIsOpen] = useState(false);

  const inputWrapperRef = useRef(null);
  const calendarRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const initialDate = useRef(date);

  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }, [value]);

  // ⭐️ 외부 클릭 시 캘린더 닫기 이벤트
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const validateDate = (field, val) => {
    if (
      (field === "day" && (val < 1 || val > 31)) ||
      (field === "month" && (val < 1 || val > 12)) ||
      (field === "year" && (val < 1000 || val > 9999))
    ) {
      return false;
    }
    const test = { ...date, [field]: val };
    const d = new Date(test.year, test.month - 1, test.day);
    return (
      d.getFullYear() === test.year &&
      d.getMonth() + 1 === test.month &&
      d.getDate() === test.day
    );
  };

  const handleInputChange = (field) => (e) => {
    const newVal = Number(e.target.value);
    const isValid = validateDate(field, newVal);
    const newDate = { ...date, [field]: newVal };
    setDate(newDate);

    if (isValid) {
      onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
    }
  };

  const handleBlur = (field) => (e) => {
    if (!e.target.value) {
      setDate(initialDate.current);
      return;
    }

    const newVal = Number(e.target.value);
    if (!validateDate(field, newVal)) {
      setDate(initialDate.current);
    } else {
      initialDate.current = { ...date, [field]: newVal };
    }
  };
  const handleKeyDown = (field) => (e) => {
    if (e.metaKey || e.ctrlKey) return;

    if (
      !/^[0-9]$/.test(e.key) &&
      ![
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Tab",
        "Backspace",
        "Enter",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      let newDate = { ...date };

      if (field === "day") {
        if (date[field] === new Date(date.year, date.month, 0).getDate()) {
          newDate = { ...newDate, day: 1, month: (date.month % 12) + 1 };
          if (newDate.month === 1) newDate.year += 1;
        } else {
          newDate.day += 1;
        }
      }

      if (field === "month") {
        if (date[field] === 12) {
          newDate = { ...newDate, month: 1, year: date.year + 1 };
        } else {
          newDate.month += 1;
        }
      }

      if (field === "year") {
        newDate.year += 1;
      }

      setDate(newDate);
      onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      let newDate = { ...date };

      if (field === "day") {
        if (date[field] === 1) {
          newDate.month -= 1;
          if (newDate.month === 0) {
            newDate.month = 12;
            newDate.year -= 1;
          }
          newDate.day = new Date(newDate.year, newDate.month, 0).getDate();
        } else {
          newDate.day -= 1;
        }
      }

      if (field === "month") {
        if (date[field] === 1) {
          newDate = { ...newDate, month: 12, year: date.year - 1 };
        } else {
          newDate.month -= 1;
        }
      }

      if (field === "year") {
        newDate.year -= 1;
      }

      setDate(newDate);
      onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
    }

    if (e.key === "ArrowRight") {
      if (
        e.currentTarget.selectionStart === e.currentTarget.value.length ||
        (e.currentTarget.selectionStart === 0 &&
          e.currentTarget.selectionEnd === e.currentTarget.value.length)
      ) {
        e.preventDefault();
        if (field === "year") monthRef.current?.focus();
        if (field === "month") dayRef.current?.focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (
        e.currentTarget.selectionStart === 0 ||
        (e.currentTarget.selectionStart === 0 &&
          e.currentTarget.selectionEnd === e.currentTarget.value.length)
      ) {
        e.preventDefault();
        if (field === "month") yearRef.current?.focus();
        if (field === "day") monthRef.current?.focus();
      }
    }
  };

  const handleDaySelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      };
      setDate(newDate);
      onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={inputWrapperRef}
      className="flex items-center text-sm gap-1 relative"
    >
      <div
        className="flex border border-input rounded-lg items-center px-1 py-2 bg-white
               focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring focus-within:outline-none"
      >
        <input
          type="text"
          ref={yearRef}
          value={date.year.toString()}
          onChange={handleInputChange("year")}
          onBlur={handleBlur("year")}
          onKeyDown={handleKeyDown("year")}
          className="w-12 text-center outline-none bg-transparent"
          placeholder="YYYY"
        />
        <span className="opacity-30 -mx-px">/</span>
        <input
          type="text"
          ref={monthRef}
          value={date.month.toString()}
          onChange={handleInputChange("month")}
          onBlur={handleBlur("month")}
          onKeyDown={handleKeyDown("month")}
          className="w-6 text-center outline-none bg-transparent"
          placeholder="MM"
        />
        <span className="opacity-30 -mx-px">/</span>
        <input
          type="text"
          ref={dayRef}
          value={date.day.toString()}
          onChange={handleInputChange("day")}
          onBlur={handleBlur("day")}
          onKeyDown={handleKeyDown("day")}
          className="p-0 w-6 text-center outline-none bg-transparent"
          placeholder="DD"
        />

        {showCalendar && (
          <button
            type="button"
            className="px-2 text-muted-foreground"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <CalendarIcon size={15} />
          </button>
        )}
      </div>

      {showCalendar && isOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full mt-2 z-50 bg-white shadow rounded-md"
        >
          <Calendar
            mode="single"
            selected={new Date(date.year, date.month - 1, date.day)}
            onSelect={handleDaySelect}
            locale={ko}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};

DateInput.displayName = "DateInput";

export { DateInput };
