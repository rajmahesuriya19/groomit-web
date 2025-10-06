import SupportItems from '@/common/SupportItems/SupportItems';

const AppointmentDetail = () => {
    return (
        <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
            {/* Tabs Section */}
            <div className="space-y-4">
                Appointment Detail
            </div>

            {/* Divider */}
            <div className="hidden md:flex justify-center">
                <div className="h-full w-[1px] bg-[#E4E4E4]" />
            </div>

            {/* Right Section */}
            <div className="space-y-4 w-full min-w-0 hidden md:block">
                <SupportItems />
            </div>
        </div>
    );
};

export default AppointmentDetail;
