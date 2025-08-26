export const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    const digits = phone.replace(/\D/g, "");
    const countryCode = digits.length === 11 ? `+${digits[0]}` : "+1";
    const cleaned = digits.length === 11 ? digits.slice(1) : digits;

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${countryCode} (${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phone;
};
