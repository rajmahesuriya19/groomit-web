import dayjs from "dayjs";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Calendar from "../assets/icon/calendar-black.svg";
import { CustomInput } from "./CustomInput";

const RHFDatePicker = ({
    name,
    control,
    label,
    views = ["year", "month"],
    format = "MM/YYYY",
    dateType = "past",
    errors,
}) => {
    const [open, setOpen] = useState(false);

    const today = dayjs().startOf("day");

    const minDate =
        dateType === "future" ? today : undefined;

    const maxDate =
        dateType === "past" ? today : undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <DatePicker
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        enableAccessibleFieldDOMStructure={false}
                        views={views}
                        openTo={views?.[0]}
                        label={label}
                        format={format}
                        maxDate={maxDate}
                        minDate={minDate}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(value) => {
                            field.onChange(
                                value
                                    ? dayjs(value)
                                        .startOf("month")
                                        .format("YYYY-MM-DD")
                                    : ""
                            );
                            setOpen(false);
                        }}
                        slots={{
                            textField: CustomInput,
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors?.[name],
                                inputProps: { readOnly: true },
                                onClick: () => setOpen(true),
                                InputProps: {
                                    endAdornment: (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpen(true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                src={Calendar}
                                                alt="Calendar"
                                                className="w-[24px] h-[24px]"
                                            />
                                        </button>
                                    ),
                                },
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};

export default RHFDatePicker;
