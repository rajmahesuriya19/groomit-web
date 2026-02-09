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

export const formatAppointmentDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

export const formatDate = (dateString) => {
    if (!dateString) return "--";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = new Date(dateString);
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

export const capitalize = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const resolvePriceByServiceType = (serviceType, normal, mobileVan) => {
    return Number(
        serviceType === "mobile-van"
            ? mobileVan ?? normal ?? 0
            : normal ?? 0
    );
};

export const resolveRecurringPrice = (serviceType, interval, key) => {
    if (!interval) return 0;

    if (serviceType === "mobile-van") {
        return Number(interval[`${key}WithMobileVanFee`] || 0);
    }

    return Number(interval[key] || 0);
};

